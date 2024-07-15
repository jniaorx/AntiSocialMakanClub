import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';
import { useId } from 'react';

export const fetchUserMatches = (userId, callback) => {

    return firestore()
    .collection('requests')
    .where('userId', '==', userId)
    .where('isMatched', '==', true)
    .onSnapshot(querySnapshot => {
        const matchedRequests = [];
        querySnapshot.forEach(doc => {
            matchedRequests.push({ id: doc.id, ...doc.data() })
        })
        callback(matchedRequests)
    }, error => {
        console.error('Error fetching requests: ', error)
    })
}

export const fetchPendingRequests = (userId, callback) => {
    
    return firestore()
    .collection('requests')
    .where('userId', '==', userId)
    .where('isMatched', '==', false)
    .onSnapshot(querySnapshot => {
        const pendingRequests = [];
        querySnapshot.forEach(doc => {
            pendingRequests.push({ id: doc.id, ...doc.data() })
        })
        callback(pendingRequests)
    }, error => {
        console.error('Error fetching pending requests: ', error)
    })
}