import React, {useState} from 'react';
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, FlatList, ImageBackground, Pressable, Image, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export const SearchResultsPage = () => {

    // const [searchQuery, onChangeSearchQuery] = React.useState('Search');
    const dummyData = require('./dummyData.json');

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text>SearchResults</Text>
            </View>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});