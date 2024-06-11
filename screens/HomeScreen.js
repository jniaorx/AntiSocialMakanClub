/*
home page allows logging out and 
creating a request by selecting from the options from the dropdowns
*/
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

// Home tab that allows sign out 
function HomeTab() {
  // Sign out button 
  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'))
      .catch(error => console.error('Error signing out: ', error));
  };

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
    </View>
  );
}

// create request tab
function RequestCreation() {
  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const dropdown1Ref = useRef();
  
  // dropdown3
  const lang = [{ title: 'English'},
                { title: 'Mandarin'},
                { title: 'Korean'},
                { title: 'Japanese'},
                { title: 'Spanish'},
                { title: 'German'},
                { title: 'Other'},  
  ];  
  
  // dropdown2
  const canteens = [{ title: 'Frontier' }, 
                    { title: 'PGP' },
                    { title: 'The Deck' },
                    { title: 'Terrace' },
                    { title: 'Techno Edge' }
  ];
  
  // dropdown1
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
  
  // to create a request
  const handleCreateRequest = async () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select both a date and a time slot.');
      return;
    }
  
  const user = auth().currentUser;
    if (!user) {
      alert('You must be logged in to create a request.');
      return;
    }
  
    const request = {
      date: selectedDate.title,
      slot: selectedSlot.title,
      canteen: selectedCanteen ? selectedCanteen.title : null,
      language: selectedLanguage ? selectedLanguage.title : null,
      userId: user.uid,
    };
  
    // to make sure that no duplicated request is made by the same user
    try {
      const querySnapshot = await firestore()
        .collection('requests')
        .where('userId', '==', user.uid)
        .where('date', '==', request.date)
        .where('slot', '==', request.slot)
        .get();
  
      if (!querySnapshot.empty) {
        alert('You have already made a request for this date and time slot.');
        return;
      }
  
      await firestore().collection('requests').add(request);
      console.log('Request added!', request);
      alert('Request created successfully!');
    } catch (error) {
      console.error('Error adding request: ', error);
    }
  };
  
  return (
    <View style={styles.requestContainer}>
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
            setSelectedDate(selectedItem);
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
            setSelectedSlot(selectedItem);
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
            setSelectedCanteen(selectedItem);
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
            setSelectedLanguage(selectedItem);
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

     <TouchableOpacity onPress={handleCreateRequest} style={styles.createButtonContainer}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Placeholder Text</Text>
    </View>
  );
}

function ViewMatch () {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Placeholder Text</Text>
    </View>
  );
}

function Chats() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Placeholder Text</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontWeight: 'bold'},
      }}>
      <Tab.Screen 
        name="Home" 
        component={HomeTab} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color="#ff000" size={20}/>
          ),
        }}
      />
      <Tab.Screen 
        name="Create Request" 
        component={RequestCreation} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircleo" color="#ff000" size={20}/>
          ),
        }}
      />
      <Tab.Screen 
        name="Your Match" 
        component={ViewMatch} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="infocirlceo" color="#ff000" size={20}/>
          ),
        }}
      />
      <Tab.Screen 
        name="Chats" 
        component={Chats} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="message1" color="#ff000" size={20}/>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" color="#ff000" size={20}/>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    //backgroundColor: '#BFF0EF',
  },
  requestContainer: {
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
    marginBottom: 500,
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
    marginTop: 50,
  },
  wlcTxt: {
    fontSize: 21.5,
    fontWeight: 'bold',
    color: '#151E26',
  },
  altContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  altText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 70,
  },  
  instructionsText: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: '#151E26',
    marginTop: 70,
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