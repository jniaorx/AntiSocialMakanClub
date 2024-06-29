import { StyleSheet, ActivityIndicator, View } from 'react-native';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  renderBubble,
  renderSystemMessage,
  renderMessage,
  renderMessageText,
  renderCustomView
} from '../utils/messageContainer';
import {
  renderInputToolbar,
  renderActions,
  renderComposer,
  renderSend
}from '../utils/inputToolbar';

const ChatScreen = ({ navigation, route }) => {
  const { chatId, matchedUserName } = route.params;
  const user = auth().currentUser;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatName, setChatName] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: matchedUserName });
  }, [navigation, matchedUserName])

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
            // sent: true,
            // received: true,
          }

          return data;
        });

        setMessages(messages);
        setLoading(false);
      });

    return () => messageListener();
  }, [chatId, user]);

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
        avatar: user.photoURL,
      }}
      renderBubble={renderBubble}
      renderMessageText={renderMessageText}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderActions}
      renderComposer={renderComposer}
      renderSend={renderSend}
      alwaysShowSend
      isTyping
      isLoadingEarlier
      scrollToBottom
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
