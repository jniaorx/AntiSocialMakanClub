import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import matchedImage from '../assets/puzzle.png';
import { createChat } from '../utils/chatFunction';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MatchFoundScreen = ({ navigation }) => {
  const route = useRoute();
  const { matchedUser, currentUser } = route.params;
  const user = auth().currentUser;

  const handleViewMatch = () => {
    navigation.navigate("Matches", { matchedUser, currentUser });
  };

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

      console.log(matchedUser)
      navigation.navigate('Chat', { chatId, matchedUserName: matchedUser.name });

    } catch (error) {
      console.error("failed to create or navigate to chat: ", error)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CONGRATULATIONS!</Text>
      <Image source={matchedImage} style={styles.image} />
      <Text style={styles.text}>You have been matched with</Text>
      <Text style={styles.username}>@{matchedUser.username}</Text>

      <TouchableOpacity onPress={handleViewMatch} style={styles.viewMatchContainer}>
        <Text style={styles.viewMatch}>View Match</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleChat} style={styles.chatContainer}>
        <Text style={styles.chat}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    color: '#666',
    marginBottom: 5,
  },
  username: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 40,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  viewMatchContainer: {
    backgroundColor: "#4A5D5E",
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  viewMatch: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    backgroundColor: "#4A5D5E",
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  chat: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
