import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import SelectDropdown from 'react-native-select-dropdown';

const SetFacultyScreen = ({ navigation }) => {
    const route = useRoute();
    const { name, username, selectedGender, selectedYos } = route.params;
    const [selectedFaculty, setSelectedFaculty] = useState(null);

    const handleNext = () => {
        if (selectedFaculty == null) {
            alert('Faculty required. Please select your faculty before proceeding.')
            return
        }
        navigation.navigate('SetBioScreen', { name, username, selectedGender, selectedYos, selectedFaculty });
    };

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
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Please select your faculty:</Text>

            <View style={styles.dropdownFacultyContainer}>
            <SelectDropdown
                data={faculty}
                onSelect={(selectedItem) => {
                    console.log(`Faculty selected: ${selectedItem.title}`);
                    setSelectedFaculty(selectedItem);
                }}
                renderButton={(selectedItem) => {
                    return (
                        <View style={styles.dropdownFacultyButtonStyle}>
                            <Text style={styles.dropdownFacultyButtonTxtStyle}>
                                {(selectedItem && selectedItem.title) || 'Select your faculty'}
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
                            <Text style={styles.dropdownFacultyItemTxtStyle}>{item.title}</Text>
                        </View>
                    );
                }}
                dropdownGenderStyle={styles.dropdownFacultyMenuStyle}
            />
            </View>

            <TouchableOpacity onPress={handleNext} style={styles.nextContainer}>
                <Text style={styles.next}>NEXT</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SetFacultyScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 20,
    },
    headerText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        color: 'black',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dropdownFacultyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
      },
      dropdownFacultyButtonStyle: {
        flex: 1,
        height: 50,
        backgroundColor: '#D2DBC8',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      },
      dropdownFacultyButtonTxtStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
        textAlign: 'center',
      },
      dropdownFacultyMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
        height: 100,
      },
      dropdownFacultyItemStyle: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#B1BDC8',
      },
      dropdownFacultyItemTxtStyle: {
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