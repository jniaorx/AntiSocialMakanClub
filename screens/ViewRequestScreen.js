import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const ViewRequestScreen = ({ route, navigation }) => {
    const { pendingRequestId } = route.params
    const [loading, setLoading] = useState(true)
    const [request, setRequest] = useState(null)

    const fetchRequestDetails = async (requestId) => {
        try {
            const requestRef = firestore().collection('requests').doc(requestId);
            const doc = await requestRef.get()
            if (doc.exists) {
                return { id: doc.id, ...doc.data() }
            } else {
                console.log('No such document!');
                return null
            }
        } catch (error) {
            console.log('Error fetching request details: ', error)
            return null;
        }
    }

    const getRequestDetails = async () => {
        setLoading(true);
        const requestDetails = await fetchRequestDetails(pendingRequestId);
        setRequest(requestDetails);
        setLoading(false);
    }

    useEffect(() => {
        getRequestDetails();
    }, [pendingRequestId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4A5D5E" />
            </View>
        ); 
    }

    return (
        <View style={styles.container}>
            <Text style={styles.info}>Date: {request.date}</Text>
            <Text style={styles.info}>Slot: {request.slot}</Text>
            <Text style={styles.info}>Canteen: {request.canteen}</Text>
            <Text style={styles.info}>Language: {request.language}</Text>
            <Text style={styles.info}>Same Gender: {request.sameGender}</Text>
            <TouchableOpacity style={styles.cancelContainer}>
                <Text style={styles.cancel}>Cancel Request</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ViewRequestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        fontSize: 20,
        padding: 15,
    },
    cancelContainer: {
        backgroundColor: "#4A5D5E",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    cancel: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
})