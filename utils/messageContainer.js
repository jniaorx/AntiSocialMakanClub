/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View, Text } from 'react-native';
import { Bubble, SystemMessage, Message, MessageText } from 'react-native-gifted-chat';

export const renderBubble = (props) => (
  <Bubble
    {...props}
    // renderTime={() => <Text>Time</Text>}
    // renderTicks={() => <Text>Ticks</Text>}
    /*
    containerStyle={{
      left: { borderColor: 'teal', borderWidth: 2 },
      right: {},
    }}
    */
    wrapperStyle={{
      left: { backgroundColor: '#daeced'},
      right: { backgroundColor: '#4A5D5E' },
    }}
    /*
    bottomContainerStyle={{
      left: { borderColor: 'red', borderWidth: 4 },
      right: {},
    }}
    */
    // tickStyle={{ color: 'red' }}
    usernameStyle={{ color: 'tomato', fontWeight: '100' }}
    /*
    containerToNextStyle={{
      left: { borderColor: 'navy', borderWidth: 4 },
      right: {},
    }}
    */
   /*
    containerToPreviousStyle={{
      left: { borderColor: 'mediumorchid', borderWidth: 4 },
      right: {},
    }}
    */
  />
);
/*
export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: 'pink' }}
    wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
    textStyle={{ color: 'crimson', fontWeight: '900' }}
  />
);
*/

/*
export const renderMessage = (props) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: 'blue' },
      right: { backgroundColor: 'gold' },
    }}
  />
);
*/

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    /*
    containerStyle={{
      left: { backgroundColor: 'red' },
      right: { backgroundColor: 'blue' },
    }}
    */
    textStyle={{
      left: { color: 'black' },
      right: { color: 'white' },
    }}
    linkStyle={{
      left: { color: 'orange' },
      right: { color: 'orange' },
    }}
    customTextStyle={{ fontSize: 18, lineHeight: 30 }}
  />
);

/*
export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 5, alignItems: 'center' }}>
    <Text>
      Current user:
      {user.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
);
*/