import React, {useState} from 'react';
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, FlatList, Pressable, Image, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export const Decks = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [DeckName, onChangeDeckName] = React.useState('New Deck');
    const [GameName, onChangeGameName] = React.useState('Game Name');
    const dummyData = require('./dummyData.json');

    function addNewDeck () {
        dummyData.Decks.push({ "name": DeckName, "game": GameName, "cards": []});
        onChangeDeckName("New Deck");
        onChangeGameName("Game Name");
        setModalVisible(!modalVisible);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Create New Deck</Text>
                        <View>
                            <Text style={styles.inputTitles}>Deck Name</Text>
                            <TextInput
                                style={styles.inputBox}
                                onChangeText={onChangeDeckName}
                                value={DeckName}
                                placeholder="New Deck"
                            />
                            <Text style={styles.inputTitles}>Game Name</Text>
                            <TextInput
                                style={styles.inputBox}
                                onChangeText={onChangeGameName}
                                value={GameName}
                                placeholder="Game"
                            />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => addNewDeck()}>
                                <Text style={styles.textStyle}>Create</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.deckGrid}>
                <FlatList
                    data = {dummyData.Decks}
                    renderItem={({ item }) =>
                    <View style={styles.deckBox}>
                        <Text style={styles.logoText}>LOGO</Text>
                        <View>
                            <Text>{item.name}</Text>
                            <Text>{item.game}</Text>
                        </View>
                    </View>
                    }
                />
            </View>
            <View style={styles.deckButtonSpace}>
                <Pressable onPress={() => setModalVisible(true)}>
                    <View style={[styles.button, styles.deckButton]}>
                        <Text style={styles.buttonText}>+ Create New Deck</Text>
                    </View>
                </Pressable>
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
    deckGrid: {
        flex: 12,
    },
    deckButtonSpace: {
        flex: 1,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    }, 
    logoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 10,
    }, 
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    deckButton: {
        backgroundColor: '#247BA0',
    },
    buttonClose: {
        backgroundColor: '#247BA0',
        marginHorizontal: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    inputTitles: {
        fontSize: 15,
        textAlign: 'left',
    },
    deckBox: {
        borderWidth: 5,
        flexDirection: 'row', 
        padding: 50,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    inputBox: {
        borderWidth: 2,
        width: 150,
        height: 25,
        alignItems: "center",
        marginVertical: 8,
        marginHorizontal: 8,
        borderColor: 'black',
    }
});