import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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