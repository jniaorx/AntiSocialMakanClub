import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import magnifyingGlass from '../assets/magnifying-glass.png';

const NoMatchScreen = ({ navigation }) => {

    const handleOk = () => {
        navigation.navigate("Create Request")
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>OOPS!</Text>
                <Image source={magnifyingGlass} style={styles.image} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>We are unable to find a match for you at the moment, but don't worry! We will keep looking.</Text>
                <Text style={styles.notify}>We will notify you once we find a match for you!</Text>
            </View>
            <TouchableOpacity onPress={handleOk} style={styles.okContainer}>
                <Text style={styles.ok}>Ok</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NoMatchScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    textContainer: {
        marginBottom: 40,
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    notify: {
        fontSize: 18,
        textAlign: 'center',
        color: '#888',
    },
    okContainer: {
        backgroundColor: "#4A5D5E",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    ok: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
})
