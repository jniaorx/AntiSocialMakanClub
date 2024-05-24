import { useNavigation } from '@react-navigation/native';
import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
    
  return (
    //avoid keyboard covering input field
    <ImageBackground source={require('../assets/food-wallpaper.jpg')} style={styles.background}>
    <KeyboardAvoidingView 
      style={styles.container}
      behaviour="padding"
    >
        <Text style={styles.headerText}>Create an account</Text>
        <Text style={styles.text}>Please fill in the details to create an account</Text>
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

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={handleRegister}
                style={styles.button}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>  
    </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
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
    buttonText: {
        color: '#f8f8ec',
        fontWeight: '700',
        fontSize: 16,
    }
})