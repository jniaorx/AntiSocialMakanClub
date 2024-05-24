import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        auth()
        .signInWithEmailAndPassword('e0000000@u.nus.edu', 'SuperSecretPassword!')
        .then(() => {
            console.log('User signed in!');
        })
        .catch(error => {
            if (error.code === 'auth/user-not-found') {
                alert('User not found. Please register first.');
            } else {
                alert(error.message);
            }
        });
    };

    const handleRegister = () => {
        auth()
        .createUserWithEmailAndPassword('e0000000@u.nus.edu', 'SuperSecretPassword!')
        .then(() => {
            console.log('User account created & signed in!');
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }
            console.error(error);
        })
    }
    
  return (
    //avoid keyboard covering input field
    <KeyboardAvoidingView 
      style={styles.container}
      behaviour="padding"
    >
        <View style={styles.inputContainer}>
            <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            />
            <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
            />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={handleRegister}
                style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
                </View>  
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttionContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: "#0702F9",
        width: '100%',
        padding: 15,
        borderRadius: 10, 
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0702F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: 'blue',
        fontWeight: '700',
        fontSize: 16,
    }
})