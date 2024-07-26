import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { createChat } from '../utils/chatFunction';
import auth from '@react-native-firebase/auth';

const ViewMatchScreen = ({ route, navigation }) => {
    const { matchedUserId } = route.params;
    const user = auth().currentUser
    // const [requests, setRequests] = useState([])
    const [currentUser, setCurrentUser] = useState(null);
    const [matchedUser, setMatchedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /*
    const getRequests = async () => {
        const requestRef = firestore().collection('requests');
        const snapshot = await requestRef.where('userId', '==', user.uid).get()
        const requests = [];
        snapshot.forEach(doc => {
            requests.push({ id: doc.id, ...doc.data() })
        })
        return requests
    }
    */

    const fetchUserDetails = async (userId) => {
        try {
            const userRef = firestore().collection('users').doc(userId);
            const doc = await userRef.get()
            if (doc.exists) {
                return { id: doc.id, ...doc.data() }
            } else {
                console.log('No such document!');
                return null;
            }
        } catch (error) {
            console.log('Error fetching user details:', error)
            return null;
        } 
    }

    const getUserDetails = async () => {
        setLoading(true);
        const matchedUserDetails = await fetchUserDetails(matchedUserId);
        setMatchedUser(matchedUserDetails);
        setLoading(false);
    }

    const getCurrentUserDetails = async () => {
        setLoading(true);
        const currentUserDetails = await fetchUserDetails(user.uid);
        setCurrentUser(currentUserDetails);
        setLoading(false);
    }

    useEffect(() => {
        getUserDetails();
    }, [matchedUserId]);

    useEffect(() => {
        getCurrentUserDetails();
    }, [user.uid]);

    // chat button
    const handleChat = async () => {
        try {
          const chatQuery = await firestore()
            .collection('chats')
            .where('members', 'array-contains', user.uid)
            .get();
    
          let chatId;
          if (chatQuery.empty) {
            chatId = await createChat(currentUser, matchedUser);
          } else {
            const chatDoc = chatQuery.docs.find(doc => doc.data().members.includes(matchedUser.id))

            if (chatDoc) {
                chatId = chatDoc.id
            } else {
                chatId = await createChat(currentUser, matchedUser)
            }
          }
    
          // console.log(matchedUser)
          navigation.navigate('Chat', { chatId, matchedUserName: matchedUser.name });
    
        } catch (error) {
          console.error("failed to create or navigate to chat: ", error)
        }
      };

      if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4A5D5E" />
            </View>
        ); 
      }

      if (!matchedUser) {
        return (
            <View style={styles.container}>
                <Text style={styles.noMatchText}>Your matched partner will be shown here once you are matched.</Text>
            </View>
        );
    }

    return (
        <View style={styles.cardContainer}>
            {matchedUser.profilePicture && (
                        <Image
                            source={{ uri: matchedUser.profilePicture }}
                            style={styles.image} />
            )}
            <Text style={styles.name}>{matchedUser.name}</Text>
            <Text style={styles.username}>@{matchedUser.username}</Text>
            <Text style={styles.bioTitle}>Bio:</Text>
            <Text style={styles.bio}>{matchedUser.bio}</Text>
            <View style={styles.infoContainer}>
                    <Text style={styles.info}>Gender: {matchedUser.gender}</Text>
                    <Text style={styles.info}>Year of Study: {matchedUser.yos}</Text>
                    <Text style={styles.info}>Faculty: {matchedUser.faculty}</Text>
            </View>
            <TouchableOpacity onPress={handleChat} style={styles.chatContainer}>
                <Text style={styles.chat}>Chat</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ViewMatchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // width: '100%', // Full width of the container
        // maxWidth: 350, // Limit the card width for larger screens
        backgroundColor: '#E0F2F1', 
        borderRadius: 12, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 8, 
        elevation: 8, 
        padding: 20,
        marginVertical: 50, 
        marginHorizontal: 30,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginTop: 5,
    },
    name: {
        fontSize: 24, 
        fontWeight: '700', 
        color: '#333', 
        marginTop: 10,
    },
    username: {
        fontSize: 16, 
        color: '#555', 
        marginBottom: 10, 
    },
    bioTitle: {
        fontSize: 19, 
        fontWeight: '600', 
        color: '#333',
    },
    bio: {
        fontSize: 19, 
        color: '#555', 
        marginBottom: 10,
    },
    /*
    infoContainer: {
        width: '50%', 
        backgroundColor: '#FFFFFF', 
        marginTop: 10, 
        // paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    */
    info: {
        fontSize: 19, 
        color: '#555', 
        marginBottom: 8, 
    },
    chatContainer: {
        backgroundColor: "#4A5D5E", 
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
    },
    chat: {
        color: 'white',
        fontSize: 18, // Adjusted font size for chat button
        fontWeight: '700', // Slightly bolder font
    },
});

