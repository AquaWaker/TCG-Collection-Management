import React, {useState} from 'react';
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, FlatList, ImageBackground, Pressable, Image, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export const SearchResultsPage = () => {

    const [searchQuery, onChangeSearchQuery] = React.useState('Search');
    const dummyData = require('./dummyData.json');

    const placeholderImage = require('./assets/wireframe.png');

    const Result = ({name, setid, id, image}) => {
        return (
            <View style={styles.resultRow}>
                <View style={styles.resultRowThumbnail}>
                    <ImageBackground
                        style={styles.cardImage}
                        source={image != 'none' ? {uri: image} : placeholderImage}
                        resizeMode='cover'
                    />
                </View>
                <View style={styles.resultRowCardInfo}>
                    <Text style={styles.cardTitle}>{name}</Text>
                    <Text style={styles.cardSubtitle}>({setid}) {id}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data = {dummyData.Cards}
                renderItem={({ item }) =>
                    <Result
                        name={item.name}
                        setid={item.setid}
                        id={item.id}
                        image={item.image}
                    />
                }
            />

            <View style={styles.inputBoxContainer}>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={onChangeSearchQuery}
                    value={searchQuery}
                    placeholder="Search"
                />
                <View>
                
                </View>
            </View>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultRow: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 160,
        paddingVertical: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultRowThumbnail: {
        width: '23%',
        height: '100%',
        marginRight: 20,
        borderRadius: 5,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    resultRowCardInfo: {
        width: '65%',
        height: '100%',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '500',
    },
    cardSubtitle: {
        fontSize: 16,
        fontWeight: '400',
    },
    inputBoxContainer: {
        width: '90%',
    },
    inputBox: {
        borderWidth: 2,
        width: '100%',
        height: 50,
        alignItems: 'center',
        marginVertical: 8,
        paddingHorizontal: 10,
        borderColor: 'black',
        borderRadius: 10,
    },
});