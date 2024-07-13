import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
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
import MatchListScreen from './screens/MatchListScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  // set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
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
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
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
