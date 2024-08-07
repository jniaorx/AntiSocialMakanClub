/*
navigable between 5 tabs: Home, Create Request, View Match, Chats and Profile
*/
import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet, Text, TouchableOpacity, View, Switch, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Title, List } from 'react-native-paper';
import MyImage from '../assets/logo-no-background.png';
import { getUsers, getRequests, findMatches } from '../utils/matchingAlgorithm';
import * as ImagePicker from 'expo-image-picker';
import Chats from './ChatListScreen';
import ViewMatch from './MatchListScreen';
import PendingRequests from './PendingRequestsScreen';
import ChangePassword from './ChangePasswordScreen';

// First tab: Home 
function HomeTab() {
  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.wlcContainer}>
        <Text style={styles.wlcTxt}>WELCOME BACK</Text>
      </View>

      <View style={styles.altContainer}>
        <Text style={styles.altText}>to</Text>
      </View>

      <Image source={MyImage} style={styles.image}/>

      <View style={styles.guideContainer}>
        <Text style={styles.headingText}>COMMUNITY GUIDELINES</Text>

        <Text style={styles.guideText}>
          1. Respectful Profiles: Do not create accounts with offensive content,
          including obscenity or profanity. Ensure your profile information is 
          appropriate and respectful. 
        </Text>

        <Text style={styles.guideText}>
          2. Honest and Legal Behaviour: Do not use your account to engage in 
          misleading, deceptive or illegal activities.
        </Text>

        <Text style={styles.guideText}>
          3. Authenticity and Identity: Do not impersonate other individuals or entities 
          without their explicit consent. Do not create multiple accounts. 
        </Text>

        <Text style={styles.guideText}>
          4. Harassment or bullying: Any form of abuse is prohibited within our app. 
          Engage with fellow users politely and with respect. 
        </Text>

        <Text style={styles.guideText}>
          5. Privacy and Confidentiality: Do not share or request personal information 
          such as addresses, phone numbers or financial details. 
        </Text>

        <Text style={styles.guideText}>
          6. Inclusive and Safe Environment: Avoid discriminatory language or behaviour 
          when interacting with other users.
        </Text>

        <Text style={styles.guideText}>
          7. Reporting and Consequences: Users can report accounts that violate 
          any of the guidelines above. Violations may result in temporary suspensions or 
          permanent bans of the offending account, depending on the severity. 
        </Text>
      </View>
    </ScrollView>
  );
}

// Second tab: Create Request
function RequestCreation({ navigation }) {
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
      userId: user.uid,
      matchedUser: '',
      isMatched: false,
      timeMatched: null,
      timeCreated: firestore.FieldValue.serverTimestamp(),
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
  
      const requestRef = await firestore().collection('requests').add(request);
      request.id = requestRef.id

      console.log('Request added!', request);
      alert('Request created successfully! We will now start matching you.');

      // run matching algorithm after successfully creating a request
      runMatchingAlgorithm({ navigation, currentRequest: request });
    } catch (error) {
      console.error('Error adding request: ', error);

      if (error.code === 'firestore/permission-denied') {
        alert('Please verify your email and re-login to continue using this app.')
      } else {
        alert('An error occured. Please try again later');
      }
    }
  };

  const runMatchingAlgorithm = async ({ navigation, currentRequest}) => {
    try {
      const users = await getUsers();
      const requests = await getRequests();
      const matches = findMatches(requests, users, currentRequest);

      if (matches.length > 0) {
        navigation.navigate('MatchFoundScreen', { matchedUser: matches[0].otherUser, currentUser: matches[0].currentUser })
      } else {
        navigation.navigate('NoMatchScreen')
      }

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
function Profile({navigation}) {
  // Sign out button 
  const [userData, setUserData] = useState(null);
  const user = auth().currentUser;
  const defaultProfilePicture = require('../assets/user-icon.png')

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
      })
      .catch(error => console.error('Error signing out: ', error));
  };

  useEffect(() => {
    const unsubscribe = firestore().collection('users').doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setUserData(doc.data());
        } else {
          console.log('No such document!');
        }
      })

      return () => unsubscribe();
  }, [user.uid]);

  if (!userData) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.userInfoContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
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
        {userData.profilePicture && (
                        <Image
                            source={{ uri: userData.profilePicture }}
                            style={styles.pfp} />
        )}
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
        {userData.emailShown && (
          <View style={styles.userInfoRow}>
            <AntDesign name="mail" color="#ff000" size={22} />
            <Text style={{ color: "#ff000", marginLeft: 10, fontSize: 17 }}>
              {user.email}
            </Text>
          </View>
        )}

        <View style={styles.userInfoRow}>
          <AntDesign name="book" color="#ff000" size={22}/>
          <Text style={{color:"#ff000", marginLeft: 10, fontSize: 17}}>{userData.faculty}</Text>
        </View>

        <View style={styles.userInfoRow}>
          <AntDesign name="calendar" color="#ff000" size={22}/>
          <Text style={{color:"#ff000", marginLeft: 10, fontSize: 17}}>{userData.yos}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Pending Requests')} 
          style={styles.otherButton}>
          <Text style={{fontSize: 17, color: 'black', fontWeight: 'bold'}}>Pending Requests</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Setting')} 
          style={styles.otherButton}>
          <Text style={{fontSize: 17, color: 'black', fontWeight: 'bold'}}>Settings</Text>
        </TouchableOpacity>
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
      <Stack.Screen name="Pending Requests" component={PendingRequests}/>
      <Stack.Screen name="Change Password" component={ChangePassword}/>
      <Stack.Screen name="Setting" component={SettingsStack} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

/*
// PendingRequests nested in Profile
const PendingRequests = () => {
  return (
    <View style={styles.tabContainer}>
    </View>
  );
}
*/

// To lead to other pages in Settings
const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="About Us" component={AboutUs}/>
      <Stack.Screen name="Report Abuse" component={ReportAbuse}/>
      <Stack.Screen name="Frequently Asked Questions" component={FAQ}/>
    </Stack.Navigator>
  )
}

// Settings nested in Profile
const Settings = ({navigation}) => {
  // toggle switch for email
  const [isEmailShown, setIsEmailShown] = useState(false);
  const user = auth().currentUser

  useEffect(() => {
    const fetchEmailVisibility = async () => {
      try {
        const userProfile = await firestore().collection('users').doc(user.uid).get();
        if (userProfile.exists) {
          setIsEmailShown(userProfile.data().emailShown || false);
        }
      } catch (error) {
        console.error('Error fetching email visibility:', error);
      }
    }

    fetchEmailVisibility();
  }, [user.uid]);

  const toggleEmail = async () => {
    setIsEmailShown(previousState => !previousState);
    try {
      await firestore().collection('users').doc(user.uid).update({ emailShown: !isEmailShown });
    } catch (error) {
      console.error('Error updating email visibility:', error);
    }
  }

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Account Settings</Text>
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Change password</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Change Password')}>
          <AntDesign name="rightcircle" color="#767577" size={20}/>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Privacy Settings</Text>
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Show Email</Text>
        <Switch
          trackColor={{false: '#767577', true: '#D2DBC8'}}
          thumbColor={'#D2DBC8'}
          onValueChange={toggleEmail}
          value={isEmailShown}
          style={styles.switch}
        />
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>More</Text>
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>About us</Text>
        <TouchableOpacity onPress={() => navigation.navigate("About Us")}>
          <AntDesign name="rightcircle" color="#767577" size={20}/>
        </TouchableOpacity>
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Report Abuse</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Report Abuse")}>
          <AntDesign name="rightcircle" color="#767577" size={20}/>
        </TouchableOpacity>
      </View>

      <View style={styles.optionLastContainer}>
        <Text style={styles.optionText}>Frequently Asked Questions</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Frequently Asked Questions")}>
          <AntDesign name="rightcircle" color="#767577" size={20}/>
        </TouchableOpacity>
      </View>

    </View>
  );
}


// About page
const AboutUs = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={MyImage} style={styles.image}/>

      <View style={styles.aboutContainer}>
        <Text style={styles.aboutText}>
        Welcome to AntiSocialMakanClub!
        </Text>

        <Text style={styles.aboutText}>
        We are two NUS undergraduates dedicated to fostering 
        strong social connections among NUS students. 
        </Text>

        <Text style={styles.aboutText}>
        Our app helps you find a meal buddy and enjoy a meal together 
        at NUS canteens.
        </Text>

        <Text style={styles.aboutText}>
        Join us to transform your meal times into 
        opportunities for making new friends 
        and building a supportive community!
        </Text>
      </View>     
    </View>
  );
}

// Report Abuse page
const ReportAbuse = () => {
  const [reportUser, setReportUser] = useState('');
  const [reason, setSelectedReason] = useState(null);
  const user = auth().currentUser

  // dropdown for reasons
  const reportReason = [{ title: 'Offensive Content' },
                        { title: 'Deceptive Activities' },
                        { title: 'Impersonating another person' },
                        { title: 'Harassment or bullying' },
                        { title: 'Discriminatory Behaviour' },
  ];

  const handleSubmitReport = async () => {
    if (!reportUser || !reason) {
      alert('Please enter a username and select a reason.');
      return;
    }

    const report = {
      reportedUser: reportUser,
      reason: reason,
      userId: user.uid,
      timeReported: firestore.FieldValue.serverTimestamp(),
    };

    try {
    const reportRef = await firestore().collection('reports').add(report);

    console.log('Report submitted!', report);
    Alert.alert('Report submitted successfully', 'We will review your report and take action as soon as possible!')
    } catch (error) {
      console.error('Error submitting report: ', error);
    }
  }
  
  return (
    <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
      <Text style={styles.reportText}>Username of the account you wish to report:</Text>

      <TextInput
        style={styles.inputReport}
        onChangeText={setReportUser}
        value={reportUser}
        placeholder='@username'
      />

      <Text style={styles.reportText}>Reasons for reporting this account:</Text>

      <View style={styles.dropdownReasonsContainer}>
        <SelectDropdown
            data={reportReason}
            onSelect={(selectedItem) => {
                console.log(`report reason chosen: ${selectedItem.title}`);
                setSelectedReason(selectedItem);
            }}
            renderButton={(selectedItem) => {
                return (
                    <View style={styles.dropdownYosButtonStyle}>
                        <Text style={styles.dropdownYosButtonTxtStyle}>
                            {(selectedItem && selectedItem.title) || 'Select A Reason'}
                        </Text>
                    </View>
                );
            }}
            renderItem={(item, isSelected) => {
                return (
                    <View
                        style={{
                            ...styles.dropdownYosItemStyle,
                            ...(isSelected && {backgroundColor: '#D2D9DF'}),
                        }}>
                        <Text style={styles.dropdownYosItemTxtStyle}>{item.title}</Text>
                    </View>
                );
            }}
            dropdownYosStyle={styles.dropdownYosMenuStyle}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmitReport}style={styles.button}>
          <Text style={styles.buttonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// FAQ page
const FAQ = () => {
  const [expanded1, setExpanded1] = useState(false);
  const handlePress1 = () => setExpanded1(!expanded1);
  const [expanded2, setExpanded2] = useState(false);
  const handlePress2 = () => setExpanded2(!expanded2);
  const [expanded3, setExpanded3] = useState(false);
  const handlePress3 = () => setExpanded3(!expanded3);
  const [expanded4, setExpanded4] = useState(false);
  const handlePress4 = () => setExpanded4(!expanded4);
  const [expanded5, setExpanded5] = useState(false);
  const handlePress5 = () => setExpanded5(!expanded5);
  const [expanded6, setExpanded6] = useState(false);
  const handlePress6 = () => setExpanded6(!expanded6);

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.sectionContainer}>
        <List.Section title="Managing Your AntiSocialMakanClub Account">
          <List.Accordion 
            title="Who Can Use Our App"
            expanded={expanded1}
            onPress={handlePress1}>
            <List.Item 
              title="NUS Students"
              description="Only NUS students can register for an account with their NUS email."/>
          </List.Accordion>

          <List.Accordion 
            title="Account Security"
            expanded={expanded2}
            onPress={handlePress2}>
            <List.Item 
              title="Changing Your Password"
              description="Find the Change Password option under Profile Settings."/>
          </List.Accordion>

          <List.Accordion 
            title="Updating Your Profile Data"
            expanded={expanded3}
            onPress={handlePress3}>
            <List.Item 
              title="Edit Your Profile"
              description="Edit your profile by clicking on the Pen Icon on the top right corner of the Profile Page."/>
          </List.Accordion>
        </List.Section>
      </View>

      <View style={styles.section2Container}>
        <List.Section title="How to">
          <List.Accordion 
            title="Get a Meal Buddy"
            expanded={expanded4}
            onPress={handlePress4}>
            <List.Item 
              title="Create a Matching Request"
              description="Select both date and a time slot and click Create. Other preferences are optional."/>
            <List.Item
              title="Find Your Match"
              description="Click on the View Match tab to find your matches."/>
            <List.Item 
              title="Chat with Your Match"
              description="Click on your match under View Match and click the Chat button."/>  
          </List.Accordion>

          <List.Accordion 
            title="Report another user"
            expanded={expanded5}
            onPress={handlePress5}>
            <List.Item 
              title="Report Abuse Portal"
              description="Submit a report under the Portal at Profile Settings."/>
          </List.Accordion>

          <List.Accordion 
            title="Cancel a request"
            expanded={expanded6}
            onPress={handlePress6}>
            <List.Item 
              title="Pending Requests"
              description="View all the requests that can be cancelled by clicking into Pending Requests."/>
            <List.Item 
              title="Cancel Request"
              description="Click into the request that you want to cancel and click the Cancel Request button."/>
          </List.Accordion>
        </List.Section>
      </View>
    </ScrollView>
  );
}

// Edit Profile nestled in Profile Tab
const EditProfile = ({ navigation }) => {
  const [bioText, setBioText] = useState('');
  const [username, setUsername] = useState(''); 
  const [selectedYos, setSelectedYos] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth().currentUser;

  // dropdown for Yos
  const Yos = [{ title: 'Year 1' },
    { title: 'Year 2' },
    { title: 'Year 3' },
    { title: 'Year 4' },
    { title: 'Year 5 or above' }
  ];

  // dropdown for faculty
  const faculty = [{ title: 'Art and Social Sciences' },
    { title: 'Business' },
    { title: 'Computing' },
    { title: 'Dentistry' },
    { title: 'Design and Engineering' },
    { title: 'Sciences' },
    { title: 'Law' },
    { title: 'Medicine' },
    { title: 'Music' },
    { title: 'Nursing' },
    { title: 'Pharmacy' },
    { title: 'NUS College'}
  ];

  /*
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userProfile = await firestore().collection('users').doc(user.uid).get();
        if (userProfile.exists) {
          const { bio, username, yos, faculty } = userProfile.data();
          setBioText(bio || '');
          setUsername(username || '');
          setSelectedYos(yos || null);
          setSelectedFaculty(faculty || null)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [user.uid])
  */

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updateData = {};
      if (bioText) updateData.bio = bioText;
      if (username) updateData.username = username;
      if (selectedYos) updateData.yos = selectedYos.title;
      if (selectedFaculty) updateData.faculty = selectedFaculty.title;
  
      let profilePictureUrl = user.photoURL;
  
      // profile pic update
      if (profilePicture && profilePicture.uri !== user.photoURL) {
        const uploadUri = profilePicture.uri;
        const filename = `${user.uid}/${new Date().getTime()}.jpg`;
        const storageRef = storage().ref(filename);
        await storageRef.putFile(uploadUri);
  
        profilePictureUrl = await storageRef.getDownloadURL();
        updateData.profilePicture = profilePictureUrl;
  
        // update firebase auth photourl
        await user.updateProfile({
          photoURL: profilePictureUrl,
        });
      }
  
      // update user doc
      await firestore().collection('users').doc(user.uid).update(updateData);
  
      // update chat pfp
      const chatsQuery = firestore().collection('chats').where('members', 'array-contains', user.uid);
      const chatDocs = await chatsQuery.get();
  
      const batch = firestore().batch();
  
      const batchUpdates = chatDocs.docs.map(async (chatDoc) => {
        const messagesRef = chatDoc.ref.collection('messages');
        const messagesSnapshot = await messagesRef.get();
        messagesSnapshot.forEach((messageDoc) => {
          const messageData = messageDoc.data();
          if (messageData.user && messageData.user._id === user.uid) {
            batch.update(messageDoc.ref, {
              'user.avatar': profilePictureUrl
            });
          }
        });
      });
  
      await Promise.all(batchUpdates);
  
      await batch.commit();
  
      alert('Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };  
  

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
        setProfilePicture({ uri: result.assets[0].uri });
        console.log("Selected image with URI:", result.assets[0].uri);
    }
};

  
  // Note: dropdowns reused from other screens
  return (
    <View style={styles.editProfileContainer}>
      <View style={styles.dropdownYosContainer}>
        <TouchableOpacity onPress={handlePickImage} style={styles.dropdownYosButtonStyle}>
          <Text style={styles.dropdownYosButtonTxtStyle}>Change Profile Picture</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        onChangeText={setBioText}
        value={bioText}
        placeholder='new bio'
      />

      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder='new username'
      />

      <View style={styles.dropdownYosContainer}>
        <SelectDropdown
            data={Yos}
            onSelect={(selectedItem) => {
                console.log(`Yos changed: ${selectedItem.title}`);
                setSelectedYos(selectedItem);
            }}
            renderButton={(selectedItem) => {
                return (
                    <View style={styles.dropdownYosButtonStyle}>
                        <Text style={styles.dropdownYosButtonTxtStyle}>
                            {(selectedItem && selectedItem.title) || 'Change Year of Study'}
                        </Text>
                    </View>
                );
            }}
            renderItem={(item, isSelected) => {
                return (
                    <View
                        style={{
                            ...styles.dropdownYosItemStyle,
                            ...(isSelected && {backgroundColor: '#D2D9DF'}),
                        }}>
                        <Text style={styles.dropdownYosItemTxtStyle}>{item.title}</Text>
                    </View>
                );
            }}
            dropdownYosStyle={styles.dropdownYosMenuStyle}
        />
      </View>

      <View style={styles.dropdownYosContainer}>
        <SelectDropdown
            data={faculty}
            onSelect={(selectedItem) => {
                console.log(`Faculty Changed: ${selectedItem.title}`);
                setSelectedFaculty(selectedItem);
            }}
            renderButton={(selectedItem) => {
                return (
                    <View style={styles.dropdownYosButtonStyle}>
                        <Text style={styles.dropdownYosButtonTxtStyle}>
                            {(selectedItem && selectedItem.title) || 'Change your faculty'}
                        </Text>
                    </View>
                );
            }}
            renderItem={(item, isSelected) => {
                return (
                    <View
                        style={{
                            ...styles.dropdownYosItemStyle,
                            ...(isSelected && {backgroundColor: '#D2D9DF'}),
                        }}>
                        <Text style={styles.dropdownYosItemTxtStyle}>{item.title}</Text>
                    </View>
                );
            }}
            dropdownGenderStyle={styles.dropdownYosMenuStyle}
        />
      </View>

      <View style={styles.updateButtonContainer}>
        <TouchableOpacity onPress={handleSaveProfile} style={styles.button}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

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
        name="Matches" 
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
    alignSelf: 'center',
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
    alignSelf: 'center',
    marginTop: 200,
    marginBottom: 10,
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
    marginBottom: -5,
    alignSelf: 'center',
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
  pfp: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center',
  },
  headerContainer: {
    width: '100%',
    marginLeft: 82,
    marginTop: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 15,
  },
  optionContainer: {
    width: '90%',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
  }, 
  optionText: {
    fontSize: 19,
    fontWeight:'500',
  },
  optionLastContainer: {
    width: '90%',
    marginBottom: 60,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  aboutContainer: {
    width:'90%',
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
    marginBottom: 100,
  },
  aboutText: {
    fontSize: 19,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#d2dbc8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    fontSize: 19,
    textAlign: 'center',
  },
  dropdownYosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginTop: 20,
    marginBottom: 20,
  },
  dropdownYosButtonStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#D2DBC8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownYosButtonTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  dropdownYosMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    height: 100,
  },
  dropdownYosItemStyle: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B1BDC8',
  },
  dropdownYosItemTxtStyle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  updateButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  editProfileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    width: '90%',
    backgroundColor: '#D2DBC8',
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  section2Container: {
    width: '90%',
    backgroundColor: '#D2DBC8',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideContainer: {
    width: '90%',
    alignItems: 'left',
    justifyContent:'space-evenly',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#D2DBC8',
  },
  guideText: {
    fontSize: 16,
    fontWeight: '30',
    marginBottom: 10,
  },
  headingText: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 15,
  },
  reportContainer: {
    marginTop: 10,
    marginBottom: 50,
  },
  reportText: {
    fontSize: 17,
    marginBottom: 10,
  },
  inputReport: {
    backgroundColor: '#D2DBC8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 25,
    width: '80%',
  },
  dropdownReasonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 70,
  },
});