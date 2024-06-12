/*
navigable between 5 tabs: Home, Create Request, View Match, Chats and Profile
*/
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// First tab: Home 
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

// Second tab: Create Request
function RequestCreation() {
  const [selectedSlot, setSelectedTime] = useState(null);
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  // date picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    console.log("Date: ", currentDate.toDateString());
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
 
  // dropdown for time slots
  const timeslot = [{ title: '11am - 12pm' }, 
                    { title: '12pm - 1pm' }, 
                    { title: '1pm - 2pm' }, 
                    { title: '2pm - 3pm' }, 
                    { title: '3pm - 4pm' }, 
                    { title: '4pm - 5pm' }, 
                    { title: '5pm - 6pm' }
  ]

  // dropdown for canteen
  const canteens = [{ title: 'Frontier' }, 
                    { title: 'PGP' },
                    { title: 'The Deck' },
                    { title: 'Terrace' },
                    { title: 'Techno Edge' }
  ];

  // dropdown for language
  const lang = [{ title: 'English'},
                { title: 'Mandarin'},
                { title: 'Korean'},
                { title: 'Japanese'},
                { title: 'Spanish'},
                { title: 'German'},
                { title: 'Other'},  
  ]; 
  
  // to create a request
  const handleCreateRequest = async () => {
    if (!date || !selectedSlot) {
      alert('Please select both a date and a time slot.');
      return;
    }
  
  const user = auth().currentUser;
    if (!user) {
      alert('You must be logged in to create a request.');
      return;
    }
  
    const request = {
      date: date.toDateString(),
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

      <View style={styles.dateContainer}>
      <TouchableOpacity style={styles.dropdownTimeButtonStyle} onPress={showDatepicker}>
          <Text style={styles.dropdownTimeButtonTxtStyle}>
            {date ? date.toDateString() : "Select a date"}
          </Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </View>

      <View style={styles.dropdownTimeContainer}>
        <SelectDropdown
          data={timeslot}
          onSelect={(selectedItem) => {
            console.log(`Timeslot selected: ${selectedItem.title}`);
            setSelectedTime(selectedItem);
          }}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdownTimeButtonStyle}>
                <Text style={styles.dropdownTimeButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Select a timeslot'}
                </Text>
              </View>
            );
          }}
          renderItem={(item, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownTimeItemStyle,
                  ...(isSelected && {backgroundColor: '#D2D9DF'}),
                }}>
                <Text style={styles.dropdownTimeItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownTimeStyle={styles.dropdownTimeMenuStyle}
        />
      </View>

      <View style={styles.instructions2Container}>
        <Text style={styles.instructions2Text}>Indicate your preferences!</Text>
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
                  {(selectedItem && selectedItem.title) || 'Select a canteen'}
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
                  {(selectedItem && selectedItem.title) || 'Select language preference'}
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

// Last Tab: Profile
function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Placeholder Text</Text>
    </View>
  );
}

// Third Tab: View Match
function ViewMatch () {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Placeholder Text</Text>
    </View>
  );
}

// Fourth Tab: Chats
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
        tabBarLabelStyle: { fontWeight: 'bold' },
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#151E26',
    marginTop: 70,
  },
  instructions2Text: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#151E26',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  dropdownTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  dropdownTimeButtonStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownTimeButtonTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  dropdownTimeMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    height: 100,
  },
  dropdownTimeItemStyle: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B1BDC8',
  },
  dropdownTimeItemTxtStyle: {
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