import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { fetchPendingRequests } from '../utils/matchFunction';

const PendingRequestsScreen = () => {
    const user = auth().currentUser;
    const [pendingRequests, setPendingRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = fetchPendingRequests(user.uid, (fetchedPendingRequests) => {
            const sortedRequets = fetchedPendingRequests.sort((a, b) => {
                const aTime = a.timeCreated ? a.timeCreated.toDate() : new Date(0);
                const bTime = b.timeCreated ? b.timeCreated.toDate() : new Date(0);
                return bTime - aTime
            })
            setPendingRequests(sortedRequets);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user.uid])

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={pendingRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const requestDate = item.date
                    const requestSlot = item.slot
                    return (
                        <TouchableOpacity onPress={() => viewRequestPress(item.id)} style={styles.requestItem}>
                            <View style={styles.requestContent}>
                                <Text style={styles.requestDate}>{requestDate}</Text>
                                <Text style={styles.matchSlot}>{requestSlot}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

export default PendingRequestsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    requestItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#e2e2e2',
        backgroundColor: '#ffffff',
    },
    requestContent: {
        flex: 1,
        marginLeft: 15,
    },
    requestDate: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
   requestSlot: {
        fontSize: 16,
        color: '#666666',
        marginTop: 5,
    },
})