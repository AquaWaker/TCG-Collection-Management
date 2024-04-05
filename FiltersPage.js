import React, {useState} from 'react';
import { Modal, StyleSheet, Text, View, SafeAreaView, FlatList, Pressable, Image, TextInput, ImageBackground} from 'react-native';
import { AntDesign, FontAwesome  } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from "@react-navigation/native";

import {
    initializeDatabase,
    insertCard,
    getAllCards,
    searchCards,
  } from './database';

import { useFilters } from './FiltersContext';
import { useResults } from './SearchResultsContext';

export const FiltersPage = () => {

    const [genreOption, setGenreOption] = React.useState(null);
    const [name, onChangeName] = React.useState('');
    const [setid, onChangeSetId] = React.useState('');
    const [price, onChangePrice] = React.useState('-1');
    const [priceOperation, setOperation] = React.useState("=");
    const { changeFilters } = useFilters();
    const { searchResults } = useResults();

    const navigation = useNavigation();

    const placeholder = {
        label: 'None selected...',
        value: null,
    };

    const OpPlaceholder = {
        label: 'Equal',
        value: '='
    }

    const optionsGenre = [
        { label: 'Magic the Gathering', value: 'magic the gathering' },
        { label: 'Pokemon', value: 'pokemon' },
        { label: 'Yugioh', value: 'yugioh' },
        { label: 'Flesh and Blood', value: 'flesh and blood' },
        { label: 'Lorcana', value: 'lorcana' },
        { label: 'Baseball', value: 'baseball' },
        { label: 'Basketball', value: 'basketball' },
        { label: 'Hockey', value: 'basketball' }
    ];

    const operations = [
        {label: 'Greater', value: '>'},
        {label: 'Greater or Equal', value: '>='},
        {label: 'Lesser', value: '<'},
        {label: 'Lesser or Equal', value: '<='},
    ]

    function searchWithFilters () {
        const newFilters = {
            name: name,
            game: genreOption,
            id: setid,
            price: price,
            operation: priceOperation,
        };
        changeFilters(newFilters);
        searchResults(newFilters);

        navigation.navigate("SEARCH RESULTS");
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{width: "80%"}}>
                <Text style={styles.inputTitles}>Search by Card Name</Text>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={onChangeName}
                    value={name}
                    placeholder="Card name"
                />

                <Text style={styles.inputTitles}>Search by Set ID</Text>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={onChangeSetId}
                    value={setid}
                    placeholder="Set ID"
                />

                <Text style={styles.inputTitles}>Search by Price</Text>
                <TextInput
                    style={styles.inputBox}
                    keyboardType='numeric'
                    onChangeText={onChangePrice}
                    value={price}
                    placeholder="Price"
                />
                <View style={styles.dropdownBox}>
                    <RNPickerSelect
                        style={{width: "100%", height: "100%"}}
                        placeholder={OpPlaceholder}
                        items={operations}
                        onValueChange={(value) => setOperation(value)}
                        value={priceOperation}
                    />
                </View>

                <Text>Sort by Game or Genre</Text>
                <View style={styles.dropdownBox}>
                    <RNPickerSelect
                        style={{width: "100%", height: "100%"}}
                        placeholder={placeholder}
                        items={optionsGenre}
                        onValueChange={(value) => setGenreOption(value)}
                        value={genreOption}
                    />
                </View>

                <Pressable
                    style={[styles.button]}
                    onPress={() => searchWithFilters()}>
                    <Text style={styles.textStyle}>Search With These Options</Text>
                </Pressable>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputTitles: {
        fontSize: 15,
        textAlign: 'left',
    },
    inputBox: {
        borderWidth: 2,
        width: "100%",
        height: 50,
        alignItems: "center",
        marginVertical: 8,
        marginHorizontal: 8,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
    },
    dropdownBox: {
        borderWidth: 2,
        width: "100%",
        height: 55,
        alignItems: "center",
        marginVertical: 8,
        marginHorizontal: 8,
        borderColor: 'black',
        borderRadius: 10,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#350023',
        marginHorizontal: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});