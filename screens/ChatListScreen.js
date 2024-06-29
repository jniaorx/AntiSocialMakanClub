import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserChats } from '../utils/chatFunction';
import auth from '@react-native-firebase/auth';

const ChatListScreen = () => {
    const navigation = useNavigation();
    const user = auth().currentUser;
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = fetchUserChats(user.uid, (fecthedChats) => {
            setChats(fecthedChats)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user.uid])

    const handleChatPress = (chatId) => {
        navigation.navigate('Chat', { chatId });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {

                    const participant = item.membersnames.find(member => member !== user.displayName)
                    return (
                    <TouchableOpacity onPress={() => handleChatPress(item.id)}>
                        <View style={styles.chatItem}>
                            <Text style={styles.chatTitle}>{participant}</Text>
                            <Text style={styles.chatSubtitle}>{item.recentMessage ? item.recentMessage.messageText : ''}</Text>
                        </View>
                    </TouchableOpacity>
                    )
                }}
            />
        </View>
    );
};

export default ChatListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e2e2',
        backgroundColor: '#ffffff',
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    chatSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginTop: 5,
    },
});
