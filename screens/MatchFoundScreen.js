import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const MatchFoundScreen = ({ navigation }) => {
    const route = useRoute();
    const { matchedUser } = route.params;

    const handleViewProfile = () => {
        navigation.navigate("Your Match")
    }

    const handleChat = () => {
        navigation.navigate("Chats")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>CONGRATULATIONS!</Text>
            <Text style={styles.text}>You have been matched with</Text>
            <Text style={styles.username}>@{matchedUser.username}</Text>

            <TouchableOpacity onPress={handleViewProfile} style={styles.viewProfileContainer}>
                <Text style={styles.viewProfile}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChat} style={styles.chatContainer}>
                <Text style={styles.chat}>Chat</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MatchFoundScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    header: {
        fontSize: 35,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 20,
    },
    username: {
        fontSize: 30,
    },
    viewProfileContainer: {
        backgroundColor: "#4A5D5E",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 90,
        width: '80%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        alignSelf: 'center',
    },
    viewProfile: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
    },
    chatContainer: {
        backgroundColor: "#4A5D5E",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: -80,
        alignSelf: 'center',
    },
    chat: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
    },
})