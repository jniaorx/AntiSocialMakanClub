import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  const handleSignOut = () => {
    auth()
    .signOut()
    .then(() => console.log('User signed out!'))
    .catch(error => console.error('Error signing out: ', error));
  };

  return (
    <View style={styles.container}>
      <Text>Welcome Back!</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#0702F9",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  }
})
