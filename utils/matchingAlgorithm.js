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
export const findMatches = (requests, users) => {
    const matches = [];
    for (let i = 0; i < requests.length; i++) {
        for (let j = i + 1; j < requests.length; j++) {
            const request1 = requests[i];
            const request2 = requests[j];

            if (request1.isMatched || request2.isMatched) {
                continue;
            }

            // get user data for request1 and request2
            const user1 = users.find(user => user.id === request1.userId);
            const user2 = users.find(user => user.id === request2.userId);

            if (
                request1.date === request2.date &&
                request1.slot === request2.slot &&
                (request1.canteen === request2.canteen || !request1.canteen || !request2.canteen || !request1.canteen && !request2.canteen || request1.canteen === 'Select a canteen' || request2.canteen === 'Select a canteen')&&
                (request1.language === request2.language || !request1.language || !request2.language || !request1.language && !request2.language || request1.language === 'Select a language' || request2.language === 'Select a language') &&
                ((request1.sameGender === 'Yes' && user1.gender === user2.gender) || request1.sameGender === 'No') &&
                ((request2.sameGender === 'Yes' && user2.gender === user1.gender || request2.sameGender === 'No'))
            ) {
                matches.push({ request1, request2 });
                markRequestAsMatched(request1.id);
                markRequestAsMatched(request2.id);
            }
        }
    }

    return matches;
}