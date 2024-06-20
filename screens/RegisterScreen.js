import { useNavigation } from '@react-navigation/native';
import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            if (!validateEmailDomain(email)) {
                alert('Please use your NUS email(@u.nus.edu) to register.');
                return;
            }

            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await user.sendEmailVerification();
            alert(`Email verification sent to ${user.email}. Please click on the link to verify your account.`);

            // Add user to Firestore with profileCompleted set to false initially
            await firestore().collection('users').doc(user.uid).set({
                email: user.email,
                profileCompleted: false,
            });

            // Navigate to profile setup screen after registration
            navigation.replace('SetNameScreen', {
                uid: user.uid,
            });

        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('That email address is already in use!');
            } else if (error.code === 'auth/invalid-email') {
                alert('That email address is invalid!');
            } else {
                console.error(error);
                alert('An error occurred: Please try again later.');
            }
        }
    };

    const validateEmailDomain = (email) => {
        const domain = email.split('@')[1];
        return domain === 'u.nus.edu';
    };

    return (
        <ImageBackground source={require('../assets/food-wallpaper.jpg')} style={styles.background}>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior="padding"
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
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 15,
    },
    text: {
        color: 'white',
        fontSize: 17,
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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