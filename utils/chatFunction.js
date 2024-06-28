import firestore, { firebase } from '@react-native-firebase/firestore';

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
    try {
        const chatRef = await firestore().collection('chats').add({
            members: {
                [user1.id]: true,
                [user2.id]: true
            },
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

export const fetchUserChats = async (userId) => {
    const querySnapshot = await firestore()
        .collection('chats')
        .where(`members.${userId}`, '==', true)
        .get();

        const chats = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return chats;
}

