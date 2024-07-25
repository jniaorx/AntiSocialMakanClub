import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import Constants from "expo-constants";
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import SetNameScreen from './screens/SetNameScreen';
import SetUsernameScreen from './screens/SetUsernameScreen';
import SetGenderScreen from './screens/SetGenderScreen';
import SetYosScreen from './screens/SetYosScreen';
import SetFacultyScreen from './screens/SetFacultyScreen';
import SetBioScreen from './screens/SetBioScreen';
import SetPfpScreen from './screens/SetPfpScreen';
import MatchFoundScreen from './screens/MatchFoundScreen';
import NoMatchScreen from './screens/NoMatchScreen';
import ChatScreen from './screens/ChatScreen';
import ViewMatchScreen from './screens/ViewMatchScreen';
import ViewRequestScreen from './screens/ViewRequestScreen';

const Stack = createNativeStackNavigator();

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background:", remoteMessage);
})

export default function App() {
  // set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Handle user state changes
  const onAuthStateChanged = async (user) => {
    setUser(user);
    if (initializing) setInitializing(false);

    if (user) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            setProfileCompleted(documentSnapshot.data().profileCompleted);
          } else {
            setProfileCompleted(false);
          }
        })

        OneSignal.login(user.uid);
    } else {
      OneSignal.logout();
    }
  }

  // Request user permission for notifications
  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  }

  // Store FCM token in Firestore
  const storeTokenInFirestore = async (token) => {
    if (user) {
      try {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .update({ fcmToken: token })
      } catch (error) {
        console.error('Error storing FCM token:', error)
      }
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    const setUpMessaging = async() => {
      await requestUserPermission();
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        storeTokenInFirestore(token);
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }

      // check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log(
              "Notification caused app to open from quit state:", remoteMessage.notification
            )
          }
        })

        // Assume a message-notofication contains a "type" property in the data payload of the screen to open
        messaging().onNotificationOpenedApp((remoteMessage) => {
          console.log("Notification caused app to open from background state:", remoteMessage.notification)
        })
        
        // Listen for incoming messages
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
        })
        
        // Clean up listeners on component unmount
        return () => {
          unsubscribe()
        }
    }

    setUpMessaging();

    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(Constants.expoConfig.extra.oneSignalAppId);

    return () => subscriber(); // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <>
    <StatusBar style="light" />
    <NavigationContainer>
      <Stack.Navigator>
      {user ? (
        <>
        <Stack.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="SetNameScreen" component={SetNameScreen} />
        <Stack.Screen options={{ title:'' }} name="SetGenderScreen" component={SetGenderScreen} />
        <Stack.Screen options={{ title:'' }} name="SetUsernameScreen" component={SetUsernameScreen} />
        <Stack.Screen options={{ title:'' }} name="SetYosScreen" component={SetYosScreen} />
        <Stack.Screen options={{ title:'' }} name="SetFacultyScreen" component={SetFacultyScreen} />
        <Stack.Screen options={{ title:'' }} name="SetBioScreen" component={SetBioScreen} />
        <Stack.Screen options={{ title:'' }} name="SetPfpScreen" component={SetPfpScreen} />
        <Stack.Screen options={{ title:'' }} name="MatchFoundScreen" component={MatchFoundScreen} />
        <Stack.Screen options={{ title:'' }} name="NoMatchScreen" component={NoMatchScreen} />
        <Stack.Screen options={({ route }) => ({
          title: route.params.chatName,
        })} name="Chat" component={ChatScreen} />
        <Stack.Screen options={{ title:'' }} name="ViewMatchScreen" component={ViewMatchScreen} />
        <Stack.Screen options={{ title:'Pending Request' }} name="ViewRequestScreen" component={ViewRequestScreen} />
        </>
        ) : (
          <>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
