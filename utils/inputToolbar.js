/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Image } from 'react-native';
import { InputToolbar, Actions, Composer, Send } from 'react-native-gifted-chat';
import picIcon from '../assets/pic-icon.png';
import sendIcon from '../assets/send-icon.png';
import sendIcon2 from '../assets/send.png';


export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: 'white',
      paddingTop: 6,
    }}
    primaryStyle={{ alignItems: 'center' }}
  />
);

export const renderActions = (props) => {
    return (
        <Actions
        {...props}
        containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
        }}
        icon={() => (
        <Image
            style={{ width: 25, height: 25 }}
            source={picIcon}
        />
        )}
        options={{
        'Choose From Library': () => {
            console.log('Choose From Library');
        },
        Cancel: () => {
            console.log('Cancel');
        },
        }}
        optionTintColor="#222B45"
    />
    )
};

export const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#222B45',
      backgroundColor: '#EDF1F7',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#E4E9F2',
      paddingHorizontal: 12,
      marginLeft: 0,
      marginRight: 0,
    }}
  />
);

export const renderSend = (props) => {
    return (
    <Send
        {...props}
        disabled={!props.text}
        containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,
        }}
    >
        <Image
        style={{ width: 25, height: 25 }}
        source={sendIcon2}
        />
    </Send>
    )
};