import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserChats } from '../utils/chatFunction';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const ChatListScreen = () => {
    const navigation = useNavigation();
    const user = auth().currentUser;
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otherUserPfps, setOtherUserPfps] = useState({});

    useEffect(() => {
        const unsubscribe = fetchUserChats(user.uid, async (fetchedChats) => {
            try {
            const sortedChats = fetchedChats.sort((a, b) => {
                const aTime = a.recentMessage && a.recentMessage.sentAt ? a.recentMessage.sentAt.toDate() : new Date(0);
                const bTime = b.recentMessage && b.recentMessage.sentAt ? b.recentMessage.sentAt.toDate() : new Date(0);
                return bTime - aTime;
            })
            setChats(sortedChats);

            const profilePics = {};
            for (const chat of sortedChats) {
                const otherUserId = chat.members.find(member => member !== user.uid)
                if (otherUserId && !profilePics[otherUserId]) {
                    const userDoc = await firestore().collection('users').doc(otherUserId).get();
                    const userData = userDoc.data();
                    if (userData) {
                        profilePics[otherUserId] = userData.profilePicture;
                    }
                }
            }
            setOtherUserPfps(profilePics);
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
        });

        return () => unsubscribe();
    }, [user.uid]);

    const handleChatPress = (chatId) => {
        navigation.navigate('Chat', { chatId });
    };

    /*
    const getOtherUserProfilePicture = (profilePictures, currentUserPhotoURL) => {
        console.log(profilePictures)
        if (profilePictures[0] === profilePictures[1]) {
            return profilePictures[0];
        }

        return profilePictures[0] === currentUserPhotoURL ? profilePictures[1] : profilePictures[0];
    };
    */

    const formatTime = (timestamp) => {
        const now = moment();
        const messageTime = moment(timestamp);

        const diffDays = now.diff(messageTime, 'days');

        if (diffDays === 0) {
            return messageTime.format('LT');
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else {
            return messageTime.format('D MMM');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const participant = item.membersnames.find(member => member !== user.displayName);
                    const otherUserId = item.members.find(member => member !== user.uid)
                    const otherUserProfilePicture = otherUserPfps[otherUserId];
                    const lastMessageTime = item.recentMessage && item.recentMessage.sentAt ? item.recentMessage.sentAt.toDate() : new Date();
                    const formattedTime = item.recentMessage && item.recentMessage.sentAt ? formatTime(lastMessageTime) : '';
                    return (
                        <TouchableOpacity onPress={() => handleChatPress(item.id)} style={styles.chatItem}>
                            <Image source={{ uri: otherUserProfilePicture }} style={styles.profilePictures} />
                            <View style={styles.chatContent}>
                                <Text style={styles.chatTitle}>{participant}</Text>
                                <Text style={styles.chatSubtitle} numberOfLines={1} ellipsizeMode="tail">
                                    {item.recentMessage ? item.recentMessage.messageText : ''}
                                </Text>
                            </View>
                            <Text style={styles.time}>{formattedTime}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

export default ChatListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#e2e2e2',
        backgroundColor: '#ffffff',
    },
    profilePictures: {
        width: 60,
        height: 60,
        borderRadius: 100,
        alignSelf: 'center',
    },
    chatContent: {
        flex: 1,
        marginLeft: 15,
    },
    chatTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    chatSubtitle: {
        fontSize: 16,
        color: '#666666',
        marginTop: 5,
    },
    time: {
        fontSize: 15,
        color: '#999999',
        alignSelf: 'center',
    },
});
