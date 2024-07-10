import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'

const SetUsernameScreen = ({ navigation }) => {
    const route = useRoute();
    const { name } = route.params;
    const [username, setUsername] = useState('');

    const checkUsername = async(username) => {
        const userRef = firestore().collection('users')
        const snapshot = await userRef.where('username', '==', username).get()
        return !snapshot.empty
    }

    const handleNext = async () => {
        if (username.trim() === '') {
            alert('Username required. Please enter your username before proceeding.')
            return;
        }
        const usernameExists = await checkUsername(username)
        if (usernameExists) {
            alert('This username is taken. Please choose another one.')
        } else {
            navigation.navigate('SetGenderScreen', { name, username });
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.headerText}>Hello, {name}!</Text>
            <Text style={styles.label}>Please enter your username:</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Enter Username"
                    placeholderTextColor="black"
                    value={username}
                    onChangeText={text => setUsername(text)}
                    style={styles.input}
                />
            </View>

            <TouchableOpacity onPress={handleNext} style={styles.nextContainer}>
                <Text style={styles.next}>NEXT</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

export default SetUsernameScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 20,
    },
    headerText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        color: 'black',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    inputContainer: {
        backgroundColor: '#d2dbc8',
        width: '80%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },
    input: {
        fontSize: 20,
        color: 'black',
    },
    nextContainer: {
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
    next: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
    },
});


