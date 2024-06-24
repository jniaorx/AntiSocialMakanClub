/*
navigable between 5 tabs: Home, Create Request, View Match, Chats and Profile
*/
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Switch, Image } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Title } from 'react-native-paper';
import MyImage from '../assets/logo-no-background.png';
import { getUsers, getRequests, findMatches } from '../utils/matchingAlgorithm';

// First tab: Home 
function HomeTab() {
  return (
    <View style={styles.homeContainer}>
      <View style={styles.wlcContainer}>
        <Text style={styles.wlcTxt}>WELCOME BACK</Text>
      </View>

      <View style={styles.altContainer}>
        <Text style={styles.altText}>to</Text>
      </View>

      <Image source={MyImage} style={styles.image}/>
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
  const canteens = [{ title: 'Select a canteen'},
                    { title: 'Frontier'}, 
                    { title: 'PGP'},
                    { title: 'The Deck'},
                    { title: 'Terrace'},
                    { title: 'Techno Edge'}
  ];

  // dropdown for language
  const lang = [{ title: 'Select a language'},
                { title: 'English'},
                { title: 'Mandarin'},
                { title: 'Korean'},
                { title: 'Japanese'},
                { title: 'Spanish'},
                { title: 'German'},
                { title: 'Other'},  
  ]; 
  
  // toggle switch
  const [isOn, setIsOn] = useState(false);
  const toggle = () => {
    setIsOn(prevState => {
      const newState = !prevState;
      console.log("Same Gender: ", newState ? "Yes" : "No");
      return newState;
    });
  };

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
      sameGender: isOn ? "Yes" : "No",
      userId: user.email,
      isMatched: false,
    };
  
    // to make sure that no duplicated request is made by the same user
    try {
      const querySnapshot = await firestore()
        .collection('requests')
        .where('userId', '==', user.email)
        .where('date', '==', request.date)
        .where('slot', '==', request.slot)
        .get();
  
      if (!querySnapshot.empty) {
        alert('You have already made a request for this date and time slot.');
        return;
      }
  
      await firestore().collection('requests').add(request);
      console.log('Request added!', request);
      alert('Request created successfully! We will now start matching you.');

      // run matching algorithm after successfully creating a request
      runMatchingAlgorithm();
    } catch (error) {
      console.error('Error adding request: ', error);

      if (error.code === 'firestore/permission-denied') {
        alert('Please verify your email and re-login to continue using this app.')
      } else {
        alert('An error occured. Please try again later');
      }
    }
  };

  const runMatchingAlgorithm = async () => {
    try {
      const users = await getUsers();
      const requests = await getRequests();
      const matches = findMatches(requests, users);

      console.log('Matches: ', matches);
    } catch (error) {
      console.log('Error running matching algorithm: ', error);
    }
  }
  
  return (
    <View style={styles.tabContainer}>
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
            minimumDate={new Date()}
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

      <Text style={styles.sameGenderText}>Same gender pairing</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.dropdown3ItemTxtStyle}>{ isOn ? "Yes" : "No Preference" }</Text>
        <Switch
          trackColor={{false: '#767577', true: '#D2DBC8'}}
          thumbColor={'#D2DBC8'}
          onValueChange={toggle}
          value={isOn}
          style={styles.switch}
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
  // Sign out button 
  const [userData, setUserData] = useState(null);
  const user = auth().currentUser;

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
      })
      .catch(error => console.error('Error signing out: ', error));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(user.email).get()
        if (userDoc.exists) {
          setUserData(userDoc.data())
        } else {
          console.log('No such document!')
        }
      } catch (error) {
        console.error('Error fetching user data: ', error)
      }
    }

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.userInfoContainer}>
          <Text>Loading...</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.userInfoContainer}>
        <View style={{ flexDirection: 'row', marginTop: 30}}>
          <Avatar.Image
            source={userData.profilePicture}
            size={123}
          />
        </View>

        < Title style={[styles.title, {
          marginTop: 15,
        }]}>{userData.name}</Title> 

        < Title style={[styles.username, {
          marginTop: -10,
          marginBottom: 10,
        }]}>@{userData.username}</Title> 

        <View style={styles.userInfoRow}>
          <Text style={{color:"#ff000", marginLeft: 10, fontSize: 17}}>{userData.bio}</Text>
        </View>
      </View>

      <View style={styles.otherInfoContainer}>
        <View style={styles.userInfoRow}>
          <AntDesign name="mail" color="#ff000" size={22}/>
          <Text style={{color:"#ff000", marginLeft: 10, fontSize: 17}}>{user.email}</Text>
        </View>

        <View style={styles.userInfoRow}>
          <AntDesign name="book" color="#ff000" size={22}/>
          <Text style={{color:"#ff000", marginLeft: 10, fontSize: 17}}>{userData.faculty}</Text>
        </View>

        <View style={styles.userInfoRow}>
          <AntDesign name="calendar" color="#ff000" size={22}/>
          <Text style={{color:"#ff000", marginLeft: 10, fontSize: 17}}>{userData.yos}</Text>
        </View>
      </View>

      <View style={styles.otherButton}>
        <Text style={{fontSize: 17, color: 'black', fontWeight: 'bold'}}>Previous Requests</Text>
      </View>

      <View style={styles.otherButton}>
        <Text style={{fontSize: 17, color: 'black', fontWeight: 'bold'}}>Settings</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

// To navigate from Profile tab to Edit Profile page
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="User Profile"
        component={Profile}
        options={({ navigation }) => ({
          headerRight: () => (
            <Feather.Button
              name="edit"
              color="#ff000"
              backgroundColor={'#fff'}
              size={20}
              onPress={() => navigation.navigate('Edit Profile')}
            />
          ),
        })}
      />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
    </Stack.Navigator>
  )
}

// Edit Profile nestled in Profile Tab
const EditProfile = () => {
  return (
    <View style={styles.tabContainer}>
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
          headerShown: false,
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
        component={ProfileStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" color="#ff000" size={20}/>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  image : {
    width: 375,
    height: 300,
    resizeMode: 'contain',
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: "#4A5D5E",
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 50,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 19,
  },
  wlcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wlcTxt: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#151E26',
  },
  altContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: -5,
  },
  altText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: '#D2DBC8',
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
    backgroundColor: '#D2DBC8',
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
  },
  dropdown3ButtonStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#D2DBC8',
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
    backgroundColor: "#4A5D5E",
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 90,
    width: '80%',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 19,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch : {
    marginLeft: 10,
  },
  sameGenderText : {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#151E26',
    marginBottom: -12.5,
  },
  userInfoContainer: {
    paddingHorizontal: 30,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 15,
  },
  userInfoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  otherInfoContainer: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'left',
  },
  otherButton: {
    backgroundColor: "#D2DBC8",
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 20,
  },
});