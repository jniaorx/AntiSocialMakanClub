import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
          }
    
        auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log('User signed in!');
        })
        .catch(error => {
            if (error.code === 'auth/user-not-found') {
                alert('User not found. Please register first.');
            } else if (error.code === 'auth/wrong-password') {
                alert('Incorrect password. Please try again.');
            } else {
                alert(error.message);
            }
        });
    };

    const handleRegister = () => {
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
          }

        auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            console.log('User account created & signed in!');
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                alert('That email address is already in use!');
            } else if (error.code === 'auth/invalid-email') {
                alert('That email address is invalid!');
            } else {
                console.error(error);
            }
        })
    }

    const handleForgotPassword = () => {
        if (!email) {
            alert('Please enter your email address.');
            return;
        }

        auth()
        .sendPasswordResetEmail(email)
        .then(() => {
            alert('Password reset email sent!');
        })
        .catch(error => {
            alert(error.message);
        });
    };
    
  return (
    //avoid keyboard covering input field
    <KeyboardAvoidingView 
      style={styles.container}
      behaviour="padding"
    >
        <Text style={styles.headerText}>Sign in now</Text>
        <Text style={styles.text}>Please sign in to continue our app</Text>
        <View style={styles.inputContainer}>
            <TextInput 
            placeholder="Email"
            placeholderTextColor="#61706b"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
            />
            <TextInput
            placeholder="Password"
            placeholderTextColor="#61706b"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
            />
            </View>

            <TouchableOpacity 
            onPress={handleForgotPassword}
            style={styles.forgotContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
                >
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
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
    headerText: {
        color: '#f8f8ec',
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 15,
    },
    text: {
        color: '#f8f8ec',
        fontSize: 15,
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#495d5e',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: '#d2dbc8',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    forgotContainer: {
        width: '80%',
    },
    forgotPasswordText: {
        color: '#f8f8ec',
        alignSelf: 'flex-end',
        paddingTop: 3,
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: "#61706b",
        alignItems: 'center',
        width: '80%',
        padding: 15,
        paddingTop: 15,
        borderRadius: 10, 
        marginBottom: 5,
    },
    buttonOutline: {
        backgroundColor: '#f8f8ec',
        marginTop: 5,
        borderColor: '#855534',
        borderWidth: 2,
    },
    buttonText: {
        color: '#f8f8ec',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#61706b',
        fontWeight: '700',
        fontSize: 16,
    }
})