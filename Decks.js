import React, {useState} from 'react';
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, FlatList, Pressable, Image, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';


export const Decks = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [isSelected, setSelection] = useState(false);
    const [DeckName, onChangeDeckName] = React.useState('New Deck');
    const [GameName, onChangeGameName] = React.useState('Game Name');
    const dummyData = require('./dummyData.json');
    const [deckModalVisible, setDeckModalVisible] = useState(false);
    const [currentDeck, setCurrentDeck] = useState(require('./empty.json'));

    function addNewDeck () {
        dummyData.Decks.push({ "name": DeckName, "game": GameName, "cards": []});
        onChangeDeckName("New Deck");
        onChangeGameName("Game");
        setModalVisible(!modalVisible);
    }

    function deckPopupSetup (deck) {
        setCurrentDeck(deck);
        setDeckModalVisible(true);
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

            <Modal
            animationType="fade"
            transparent={true}
            visible={deckModalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setDeckModalVisible(!deckModalVisible);
            }}>
                <View style={styles.centeredDeckView}>
                    <View style={styles.backButton}>
                        <Pressable onPress={() => setDeckModalVisible(!deckModalVisible)}>
                            <AntDesign name="arrowleft" size={24} color="white" />
                        </Pressable>
                    </View>
                    <View style={{flexDirection: 'row', width: '90%'}}>
                        <Text style={styles.logoDeckText}>LOGO</Text>
                        <View>
                            <Text style={styles.deckNamePopup}>{currentDeck.name}</Text>
                            <View style={{width: '80%'}}>
                                <Text style={styles.deckDesPopup}>{currentDeck.description}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 15}}>
                        <View style={{flex: 1, height: 1, backgroundColor: 'white'}} />
                        <View>
                            <Text style={{width: 50, textAlign: 'center', color: 'white'}}>Cards</Text>
                        </View>
                        <View style={{flex: 1, height: 1, backgroundColor: 'white'}} />
                    </View>

                    <View style={{width: '90%', height: '75%'}}>
                        <FlatList
                            data = {currentDeck.cards}
                            renderItem={({ item }) =>
                            <View style={styles.cardList}>
                                <Text style={styles.cardText}>{item.name}</Text>
                            </View>
                            }
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.deckGrid}>
                <FlatList
                    data = {dummyData.Decks}
                    renderItem={({ item }) =>
                    <Pressable onPress={() => deckPopupSetup(item)}>
                        <View style={styles.deckBox}>
                            <Text style={styles.logoText}>LOGO</Text>
                            <View>
                                <Text>{item.name}</Text>
                                <Text>{item.game}</Text>
                            </View>
                        </View>
                    </Pressable>
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
    },
    centeredDeckView: {
        height: '75%',
        width: '100%',
        backgroundColor: '#586F7C',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 90,
    },
    backButton: {
        justifyContent: 'flex-end',
        marginVertical: 10,
    },
    checkbox: {
        alignSelf: 'center',
    },
    logoDeckText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 10,
    }, 
    cardText: {
        fontSize: 15,
        color: 'white',
        textAlign: 'left',
    }, 
    deckNamePopup: {
        color: 'white',
        fontSize: 20,
    },
    deckDesPopup: {
        color: 'white',
        fontSize: 15,
    }, 
    cardList: {
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        width: '90%',
    }
});