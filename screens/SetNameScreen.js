import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import MyImage from '../assets/logo-no-background.png';

const SetNameScreen = ({ navigation }) => {
    const [name, setName] = useState('');

    const handleNext = () => {
        if (name.trim() === '') {
            alert('Name required. Please enter your name before proceeding.')
            return;
        }
        navigation.navigate('SetGenderScreen', { name });
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
             <Text style={styles.wlctxt}>Welcome!</Text>
            <Image source={MyImage} style={styles.image}/>
            <Text style={styles.headerText}>Let's start setting up your profile!</Text>
            <Text style={styles.label}>Name</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Enter Name"
                    placeholderTextColor="black"
                    value={name}
                    onChangeText={text => setName(text)}
                    style={styles.input}
                />
            </View>

            <TouchableOpacity onPress={handleNext} style={styles.nextContainer}>
                <Text style={styles.next}>NEXT</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

export default SetNameScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 20,
    },
    wlctxt: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image : {
        width: 375,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 30,
      },
    headerText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -10,
    },
    label: {
        color: 'black',
        fontSize: 17,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 5,
        marginLeft: 40,
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


