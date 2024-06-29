// ChatScreen.js
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatScreen = ({ route }) => {
  const { chatId } = route.params;
  const user = auth().currentUser;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const messageListener = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: firebaseData.text,
            createdAt: firebaseData.createdAt ? firebaseData.createdAt.toDate() : new Date(),
            user: {
              _id: firebaseData.user._id,
              name: firebaseData.user.name,
              avatar: user.photoURL,
            },
          }

          return data;
        });

        setMessages(messages);
        setLoading(false);
      });

    return () => messageListener();
  }, [chatId]);

  const handleSend = useCallback((messages = []) => {
    onSend(chatId, user, messages);
  }, [chatId, user]);

  const onSend = async (chatId, user, messages = []) => {
    const text = messages[0].text;

    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add({
        text,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: {
          _id: user.uid,
          name: user.displayName,
        },
      });

      await firestore()
        .collection('chats')
        .doc(chatId)
        .update({
          recentMessage: {
            messageText: text,
            senderId: user.uid,
            sentAt: firestore.FieldValue.serverTimestamp(),
          },
          read: false,
        })
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{
        _id: user.uid,
        name: user.displayName,
      }}
    />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 20,
  },
});
