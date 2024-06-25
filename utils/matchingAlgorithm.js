import firestore from '@react-native-firebase/firestore'

// fetch user data from Firestore
export const getUsers = async () => {
    const userRef = firestore().collection('users');
    const snapshot = await userRef.get();
    const users = [];
    snapshot.forEach(doc => {
        users.push({ id: doc.id, ... doc.data() });
    });
    return users;
}

// fetch request data from Firestore
export const getRequests = async () => {
    const requestRef = firestore().collection('requests');
    const snapshot = await requestRef.get();
    const requests = [];
    snapshot.forEach(doc => {
        requests.push({ id: doc.id, ... doc.data() });
    });
    return requests;
}

// to mark matched request
export const markRequestAsMatched = async (requestId) => {
    try {
        await firestore().collection('requests').doc(requestId).update({ isMatched: true })
    } catch (error) {
        console.log('Error marking request as matched: ', error);
    }
}

// matching algorithm
export const findMatches = (requests, users, currentRequest) => {
    const matches = [];

    const currentUser = users.find(user => user.id === currentRequest.userId)

    for (let i = 0; i < requests.length; i++) {
        const otherRequest = requests[i]

            if (otherRequest.isMatched || otherRequest.userId === currentRequest.userId) {
                continue;
            }

            const otherUser = users.find(user => user.id === otherRequest.userId)

            if (
                currentRequest.date === otherRequest.date &&
                currentRequest.slot === otherRequest.slot &&
                (currentRequest.canteen === otherRequest.canteen || !currentRequest.canteen || !otherRequest.canteen || !currentRequest.canteen && !otherRequest.canteen || currentRequest.canteen === 'Select a canteen' || otherRequest.canteen === 'Select a canteen')&&
                (currentRequest.language === otherRequest.language || !currentRequest.language || !otherRequest.language || !currentRequest.language && !otherRequest.language || currentRequest.language === 'Select a language' || otherRequest.language === 'Select a language') &&
                ((currentRequest.sameGender === 'Yes' && currentUser.gender === otherUser.gender) || currentRequest.sameGender === 'No') &&
                ((otherRequest.sameGender === 'Yes' && otherUser.gender === currentUser.gender || otherRequest.sameGender === 'No'))
            ) {
                matches.push({ currentRequest, otherUser, otherRequest })
                markRequestAsMatched(currentRequest.id)
                markRequestAsMatched(otherRequest.id)
                break;
            }
        }
        return matches;
    }
  