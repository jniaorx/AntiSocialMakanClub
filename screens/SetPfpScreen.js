import { KeyboardAvoidingView, StyleSheet, Text, Button, TouchableOpacity, View, Image } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';

const SetPfpScreen = ({ navigation }) => {
    const route = useRoute();
    const { name, username, selectedGender, selectedYos, selectedFaculty, bio } = route.params;
    const [profilePicture, setProfilePicture] = useState(require('../assets/user-icon.png'));

    const handleSaveProfile = async () => {
        const user = auth().currentUser;
        
        const userData = {
            name,
            username,
            gender: selectedGender.title,
            yos: selectedYos.title,
            faculty: selectedFaculty.title,
            profilePicture: profilePicture.uri || profilePicture,
        };

        if (bio) {
            userData.bio = bio;
        }

        try {
            await firestore().collection('users').doc(user.email).set(userData);
            alert('Profile creation succesful!')
            navigation.replace('HomeScreen');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile. Try again later.');
        }
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setProfilePicture({ uri: result.assets[0].uri });
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.label}>Pick a profile picture:</Text>
            <View>
                <Image source={profilePicture} style={styles.image} />
                <Button title="Pick an image" onPress={handlePickImage} />
            </View>

            <TouchableOpacity onPress={handleSaveProfile} style={styles.nextContainer}>
                <Text style={styles.next}>FINISH</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default SetPfpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 20,
    },
    label: {
        color: 'black',
        fontSize: 17,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
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
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
        alignSelf: 'center',
    },
});
