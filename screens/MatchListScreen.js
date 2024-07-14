import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserMatches } from '../utils/matchFunction';
import auth from '@react-native-firebase/auth';

const MatchListScreen = () => {
    const navigation = useNavigation()
    const user = auth().currentUser
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = fetchUserMatches(user.uid, (fetchedMatches) => {
            const sortedMatches = fetchedMatches.sort((a, b) => {
                const aTime = a.timeMatched ? a.timeMatched.toDate() : new Date(0);
                const bTime = b.timeMatched ? b.timeMatched.toDate() : new Date(0);
                return bTime - aTime;
            })
            setMatches(sortedMatches);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user.uid])

    const handleMatchPress = (matchedUserId) => {
        navigation.navigate('ViewMatchScreen', { matchedUserId })
    }

    if (loading) {
        return (
            <View style={StyleSheet.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    return (
        <View style={StyleSheet.container}>
            <FlatList
                data={matches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const requestDate = item.date
                    const requestSlot = item.slot
                    return (
                        <TouchableOpacity onPress={() => handleMatchPress(item.matchedUser)} style={styles.matchItem}>
                            <View style={styles.matchContent}>
                                <Text style={styles.matchDate}>{requestDate}</Text>
                                <Text style={styles.matchSlot}>{requestSlot}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

export default MatchListScreen

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
    matchItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#e2e2e2',
        backgroundColor: '#ffffff',
    },
    matchContent: {
        flex: 1,
        marginLeft: 15,
    },
    matchDate: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
   matchSlot: {
        fontSize: 16,
        color: '#666666',
        marginTop: 5,
    },
})