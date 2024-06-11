import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import { useEffect, useState } from 'react';

const Stack = createNativeStackNavigator();

export default function App() {
  // set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
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
          <Stack.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} />
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
