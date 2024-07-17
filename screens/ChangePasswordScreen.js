import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';

const ChangePasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Error','Please enter your email address');
            return;
        }

        try {
            await auth().sendPasswordResetEmail(email);
            Alert.alert('Success','Password reset email sent successfully');
            navigation.goBack();
        } catch (error) {
            alert('Error', error.message)
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.headerText}>Please enter your email to reset your password.</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Enter Email"
                    placeholderTextColor="black"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
            </View>

            <TouchableOpacity onPress={handlePasswordReset} style={styles.confirmContainer}>
                <Text style={styles.confirm}>CONFIRM</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default ChangePasswordScreen

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
    confirmContainer: {
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
    confirm: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
    },
})

