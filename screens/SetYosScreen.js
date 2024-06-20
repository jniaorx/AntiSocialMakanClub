import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import SelectDropdown from 'react-native-select-dropdown';

const SetYosScreen = ({ navigation }) => {
    const route = useRoute();
    const { name, username, selectedGender } = route.params;
    const [selectedYos, setSelectedYos] = useState(null);


    const handleNext = () => {
        if (selectedYos == null) {
            alert('YOS required. Please select your years of study before proceeding.')
            return;
        }
        navigation.navigate('SetFacultyScreen', { name, username, selectedGender, selectedYos });
    };

    // dropdown for Yos
    const Yos = [{ title: 'Year 1' },
                    { title: 'Year 2' },
                    { title: 'Year 3' },
                    { title: 'Year 4' },
                    { title: 'Year 5 or above' }
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Please select your years of study:</Text>

            <View style={styles.dropdownYosContainer}>
            <SelectDropdown
                data={Yos}
                onSelect={(selectedItem) => {
                    console.log(`Yos selected: ${selectedItem.title}`);
                    setSelectedYos(selectedItem);
                }}
                renderButton={(selectedItem) => {
                    return (
                        <View style={styles.dropdownYosButtonStyle}>
                            <Text style={styles.dropdownYosButtonTxtStyle}>
                                {(selectedItem && selectedItem.title) || 'Select your YOS'}
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

            <TouchableOpacity onPress={handleNext} style={styles.nextContainer}>
                <Text style={styles.next}>NEXT</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SetYosScreen

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
    dropdownYosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
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