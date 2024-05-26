/*
home page allows logging out and 
creating a request by selecting from the options from the dropdowns
*/

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  //sign out button
  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'))
      .catch(error => console.error('Error signing out: ', error));
  };

  //dropdown3
  const lang = [{ title: 'English'},
                { title: 'Mandarin'},
                { title: 'Korean'},
                { title: 'Japanese'},
                { title: 'Spanish'},
                { title: 'German'},
                { title: 'Other'},
  ];

  //dropdown2
  const canteens = [{ title: 'Frontier' }, 
                    { title: 'PGP' },
                    { title: 'The Deck' },
                    { title: 'Terrace' },
                    { title: 'Techno Edge' }
  ];

  //dropdown1
  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);
  const dropdown1Ref = useRef();

  useEffect(() => {
    setTimeout(() => {
      setDates([
        { title: 'Today', 
          slots: [{ title: '11am - 12pm' }, 
                  { title: '12pm - 1pm' }, 
                  { title: '1pm - 2pm' }, 
                  { title: '2pm - 3pm' }, 
                  { title: '3pm - 4pm' }, 
                  { title: '4pm - 5pm' }, 
                  { title: '5pm - 6pm' }]},
        { title: 'Tomorrow', 
          slots: [{ title: '11am - 12pm' }, 
                  { title: '12pm - 1pm' }, 
                  { title: '1pm - 2pm' }, 
                  { title: '2pm - 3pm' }, 
                  { title: '3pm - 4pm' }, 
                  { title: '4pm - 5pm' }, 
                  { title: '5pm - 6pm' }]},
      ]);
    }, 10);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.wlcContainer}>
        <Text style={styles.wlcTxt}>Welcome Back to AntiSocialMakanClub</Text>
      </View>

      <View style={styles.altContainer}>
        <Text style={styles.altText}>or</Text>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>

      <View style={styles.requestContainer}>
        <Text style={styles.requestText}>Create a Request</Text>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>Select a Date and Time to start matching!</Text>
      </View>

      <View style={styles.dropdown1Container}>
        <SelectDropdown
          data={dates}
          onSelect={(selectedItem) => {
            console.log(`Day selected: ${selectedItem.title}`);
            dropdown1Ref.current.reset();
            setSlots([]);
            setSlots(selectedItem.slots);
          }}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdown1ButtonStyle}>
                <Text style={styles.dropdown1ButtonTxtStyle}>{selectedItem?.title || 'Select a day'}</Text>
              </View>
            );
          }}
          renderItem={(item, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdown1ItemStyle,
                  ...(isSelected && {backgroundColor: '#D2D9DF'}),
                }}>
                <Text style={styles.dropdown1ItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          dropdown1Style={styles.dropdown1MenuStyle}
        />
        <View style={{width: 8}} />
        <SelectDropdown
          ref={dropdown1Ref}
          data={slots}
          onSelect={(selectedItem) => {
            console.log(`Timeslot selected: ${selectedItem.title}`);
          }}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdown1ButtonStyle}>
                <Text style={styles.dropdown1ButtonTxtStyle}>{selectedItem?.title || 'Select a timeslot'}</Text>
              </View>
            );
          }}
          renderItem={(item, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdown1ItemStyle,
                  ...(isSelected && {backgroundColor: '#D2D9DF'}),
                }}>
                <Text style={styles.dropdown1ItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          dropdown1Style={styles.dropdown1MenuStyle}
        />
      </View>

      <View style={styles.instructions2Container}>
        <Text style={styles.instructions2Text}>Canteen & spoken language preferences are optional.</Text>
      </View>
      
      <View style={styles.dropdown2Container}>
        <SelectDropdown
          data={canteens}
          onSelect={(selectedItem) => {
            console.log(`Canteen selected: ${selectedItem.title}`);
          }}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdown2ButtonStyle}>
                <Text style={styles.dropdown2ButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Select your canteen'}
                </Text>
              </View>
            );
          }}
          renderItem={(item, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdown2ItemStyle,
                  ...(isSelected && {backgroundColor: '#D2D9DF'}),
                }}>
                <Text style={styles.dropdown2ItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdown2Style={styles.dropdown2MenuStyle}
        />
      </View>

      <View style={styles.dropdown3Container}>
        <SelectDropdown
          data={lang}
          onSelect={(selectedItem) => {
            console.log(`Language selected: ${selectedItem.title}`);
          }}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdown3ButtonStyle}>
                <Text style={styles.dropdown3ButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Select your language preference'}
                </Text>
              </View>
            );
          }}
          renderItem={(item, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdown3ItemStyle,
                  ...(isSelected && {backgroundColor: '#D2D9DF'}),
                }}>
                <Text style={styles.dropdown3ItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdown3Style={styles.dropdown3MenuStyle}
        />
      </View>

      <View style={styles.createButtonContainer}>
        <Text style={styles.createButtonText}>Create</Text>
      </View>

    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ADD8E6',
  },
  button: {
    backgroundColor: "#0702F9",
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  wlcContainer: {
    position: 'absolute',
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
  },
  wlcTxt: {
    fontSize: 21.5,
    fontWeight: 'bold',
    color: '#151E26',
  },
  altContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  altText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 70,
  }, 
  requestContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 45,
    //backgroundColor: '#4682B4',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  requestText: {
    fontSize: 20,
    fontWeight: 'bold',
  },  
  instructionsText: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: '#151E26',
  },
  instructions2Text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#151E26',
  },
  dropdown1Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 15,
  },
  dropdown1ButtonStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdown1ButtonTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  dropdown1MenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    height: 100,
  },
  dropdown1ItemStyle: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B1BDC8',
  },
  dropdown1ItemTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  dropdown2Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  dropdown2ButtonStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdown2ButtonTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  dropdown2MenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    height: 100,
  },
  dropdown2ItemStyle: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B1BDC8',
  },
  dropdown2ItemTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  dropdown3Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 10,
  },
  dropdown3ButtonStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown3ButtonTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  dropdown3MenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    height: 100,
  },
  dropdown3ItemStyle: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B1BDC8',
  },
  dropdown3ItemTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  createButtonContainer: {
    backgroundColor: "#0702F9",
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 100,
    width: '80%'
  },
  createButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 19,
  },
});