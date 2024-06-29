import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const ViewMatchScreen = ({ route }) => {
    const { matchedUser } = route.params;

    return (
        <View style={styles.container}>
            <Image source={matchedUser.profilePicture} style={styles.image} />
            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{matchedUser.name}</Text>
                <Text style={styles.username}>@{matchedUser.username}</Text>
                <View style={styles.bioContainer}>
                    <Text style={styles.bioTitle}>Bio:</Text>
                    <Text style={styles.bio}>{matchedUser.bio}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.info}>Gender: {matchedUser.gender}</Text>
                    <Text style={styles.info}>Year of Study: {matchedUser.yos}</Text>
                    <Text style={styles.info}>Faculty: {matchedUser.faculty}</Text>
                </View>
            </View>
        </View>
    );
};

export default ViewMatchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginTop: 20,
    },
    detailsContainer: {
        alignItems: 'center',
        marginTop: 20,
        width: '90%',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: -10,
    },
    username: {
        fontSize: 18,
        color: '#777',
        marginBottom: 10,
    },
    bioContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    bioTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    bio: {
        fontSize: 16,
        color: '#555',
    },
    infoContainer: {
        width: '100%',
    },
    info: {
        fontSize: 20,
        color: '#555',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
});
