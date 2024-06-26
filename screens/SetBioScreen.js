import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'

const SetBioScreen = ({ navigation }) => {
    const route = useRoute();
    const { name, username, selectedGender, selectedYos, selectedFaculty } = route.params;
    const [bio, setBio] = useState('');

    const handleNext = () => {
        navigation.navigate('SetPfpScreen', { name, username, selectedGender, selectedYos, selectedFaculty, bio });
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.headerText}>Let people to get to know you!</Text>
            <Text style={styles.label}>Write a bio: </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Enter Bio (Optional)"
                    placeholderTextColor="black"
                    value={bio}
                    onChangeText={text => setBio(text)}
                    style={styles.input}
                    multiline={true}
                    numberOfLines={4}
                />
            </View>

            <TouchableOpacity onPress={handleNext} style={styles.nextContainer}>
                <Text style={styles.next}>NEXT</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

export default SetBioScreen

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
        fontSize: 18,
        color: 'black',
        textAlignVertical: 'top',
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


