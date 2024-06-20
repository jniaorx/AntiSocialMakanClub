import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import SelectDropdown from 'react-native-select-dropdown';

const SetGenderScreen = ({ navigation }) => {
    const route = useRoute();
    const { name, username } = route.params;
    const [selectedGender, setSelectedGender] = useState(null);


    const handleNext = () => {
        if (selectedGender == null) {
            alert('Gender required. Please select your gender before proceeding.')
            return;
        }
        navigation.navigate('SetYosScreen', { name, username, selectedGender });
    };

    // dropdown for gender
    const gender = [{ title: 'Male' },
                    { title: 'Female' },
                    { title: 'Others' }
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Please select your gender:</Text>
            <View style={styles.dropdownGenderContainer}>
            <SelectDropdown
                data={gender}
                onSelect={(selectedItem) => {
                    console.log(`Gender selected: ${selectedItem.title}`);
                    setSelectedGender(selectedItem);
                }}
                renderButton={(selectedItem) => {
                    return (
                        <View style={styles.dropdownGenderButtonStyle}>
                            <Text style={styles.dropdownGenderButtonTxtStyle}>
                                {(selectedItem && selectedItem.title) || 'Select your gender'}
                            </Text>
                        </View>
                    );
                }}
                renderItem={(item, isSelected) => {
                    return (
                        <View
                            style={{
                                ...styles.dropdownGenderItemStyle,
                                ...(isSelected && {backgroundColor: '#D2D9DF'}),
                            }}>
                            <Text style={styles.dropdownGenderItemTxtStyle}>{item.title}</Text>
                        </View>
                    );
                }}
                dropdownGenderStyle={styles.dropdownGenderMenuStyle}
            />
            </View>

            <TouchableOpacity onPress={handleNext} style={styles.nextContainer}>
                <Text style={styles.next}>NEXT</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SetGenderScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 20,
    },
    label: {
        color: 'black',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dropdownGenderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
      },
      dropdownGenderButtonStyle: {
        flex: 1,
        height: 50,
        backgroundColor: '#D2DBC8',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      },
      dropdownGenderButtonTxtStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
        textAlign: 'center',
      },
      dropdownGenderMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
        height: 100,
      },
      dropdownGenderItemStyle: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#B1BDC8',
      },
      dropdownGenderItemTxtStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
        textAlign: 'center',
      },
      nextContainer: {
        backgroundColor: "#4A5D5E",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 90,
        width: '80%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        alignSelf: 'center',
    },
    next: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
    },
})