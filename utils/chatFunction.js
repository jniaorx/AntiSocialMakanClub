import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

/*

// to create chat between two matched users
export const createChat = async (userId1, userId2) => {
    const chatRef = firestore().collection('chats').doc();
    const chatId = chatRef.id

    // save chat ID to each user's data
    await firestore().collection('users').doc(userId1).update({
        chats: firestore.FieldValue.arrayUnion(chatId),
    });
    await firestore().collection('users').doc(userId2).update({
        chats: firestore.FieldValue.arrayUnion(chatId),
    })

    await chatRef.set({
        members: [userId1, userId2],
        createdAt: firestore.FieldValue.serverTimestamp(),
        recentMessage: {
            messageText: '',
            senderId: '',
            sentAt: null,
        },
        read: false,
    });
    return chatRef.id;
}
*/

export const createChat = async (user1, user2) => {
    const user = auth().currentUser;
    try {
        const chatRef = await firestore().collection('chats').add({
            members: [user1.id, user2.id],
            membersnames: [user1.name, user2.name],
            createdAt: firestore.FieldValue.serverTimestamp(),
            recentMessage: {
                messageText: '',
                senderId: '',
                sentAt: null,
            },
            read: false,
        });
        return chatRef.id;
    } catch (error) {
        console.error("Error creating chat: ", error);
        throw error; // Optionally throw the error to handle it where this function is called
    }
};


/*
// to send message in chat
export const sendMessage = async (chatId, senderId, messageText) => {
    const messageRef = firestore().collection('messages').doc(chatId).collection('messages');
    const chatRef = firestore().collection('chats').doc(chatId);

    const message = {
        chatId,
        senderId,
        messageText,
        sentAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
        // add message to messages collection
        await messageRef.add(message);

        await chatRef.update({
            recentMessage: {
                messageText,
                senderId,
                sentAt: firestore.FieldValue.serverTimestamp(),
            },
            read: false,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        console.log('Message sent successfully!');
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
*/

/*
// to mark message as read
export const markMessageAsRead = async (chatId, messageId) => {
    try {
        await firestore()
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .doc(messageId)
            .update({
                read: true
            });
    } catch (error) {
        console.error('Failed to mark message as read:', error)
    }
}
*/

export const fetchUserChats = (userId, callback) => {
        return firestore()
        .collection('chats')
        .where('members', 'array-contains', userId)
        .onSnapshot(querySnapshot => {
            const chats = [];
            querySnapshot.forEach(doc => {
                chats.push({ id: doc.id, ...doc.data() });
            })
            callback(chats)
        })
    }

