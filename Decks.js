import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, FlatList, Pressable, TextInput } from 'react-native';
import { AntDesign,MaterialIcons ,FontAwesome } from '@expo/vector-icons';
import { getAllDecks, addNewDeckDB, addNewDeck} from './database';
import { useNavigation } from '@react-navigation/native';
import { getCardsForDeck } from './database';


export const Decks = () => {
    const [decks, setDecks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editEnabled, setEditEnabled] = useState(false);
    const [DeckName, onChangeDeckName] = useState('New Deck');
    const [GameName, onChangeGameName] = useState('Game Name');
    const [Description, onChangeDescription] = useState('');
    const [editName, onChangeEditName] = useState('');
    const [editDes, onChangeEditDes] = useState('');
    const [deckModalVisible, setDeckModalVisible] = useState(false);
    const [currentDeck, setCurrentDeck] = useState(null);
    const refreshDecks = () => {
        getAllDecks()
            .then(decksFromDB => {
                const uniqueDeckMap = new Map();
                decksFromDB.forEach(deck => {
                    const compositeKey = `${deck.name}-${JSON.stringify(deck.cards)}-${deck.game}-${deck.description}`;
                    if (!uniqueDeckMap.has(compositeKey)) {
                        uniqueDeckMap.set(compositeKey, deck);
                    }
                });
                const uniqueDecks = Array.from(uniqueDeckMap.values());
                setDecks(uniqueDecks);
            })
            .catch(error => {
                console.error('Failed to load decks:', error);
            });
    };

    useEffect(() => {
        refreshDecks();
    }, []);

    const onAddPress = () => {
        Alert.alert("New Card Was Added", "your new card was added successfully!", [{ text: "OK", onPress: () => console.log("OK Pressed") }], { cancelable: true });
    };

    const addNewDeck = () => {
        setModalVisible(true);
    };

    const [deckCards, setDeckCards] = useState([]);
    const deckCardPopupSetup = (deck) => {
        setCurrentDeck(deck);
    setModalVisible(false);
    setDeckModalVisible(true);
    
    // Fetch cards for the current deck
    getCardsForDeck(deck.id)
        .then(cards => {
            // Log the fetched cards
            console.log("Fetched cards for deck:", cards);
            
            // Update state with the fetched cards
            setDeckCards(cards);
        })
        .catch(error => {
            console.error('Failed to fetch cards for deck:', error);
            // Handle the error appropriately
        });
    };

    const deckPopupSetup = (deck) => {
        setCurrentDeck(deck);
        setModalVisible(false);
        setDeckModalVisible(true);
        
    };    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.deckGrid}>
                <FlatList
                    data={decks}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => deckPopupSetup(item)}>
                            <View style={styles.opaqueBox}>
                                <View style={styles.deckBox}>
                                    <Text style={styles.logoText}>LOGO</Text>
                                    <View>
                                        <Text>{item.name}</Text>
                                        <Text>{item.game}</Text>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
                <Pressable
                    style={[styles.button, styles.addButton]}
                    onPress={addNewDeck}
                >
                    <Text style={styles.buttonText}>+ Add New Deck</Text>
                </Pressable>

                <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
        setModalVisible(false);
    }}
>
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <TextInput
                style={styles.input}
                onChangeText={onChangeDeckName}
                value={DeckName}
                placeholder="Deck Name"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeGameName}
                value={GameName}
                placeholder="Game Name"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeDescription}
                value={Description}
                placeholder="Description"
            />
            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.textStyle}>Close</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, styles.buttonOk]}
                    onPress={() => {
                        addNewDeckDB(DeckName, GameName, Description, setModalVisible, refreshDecks, onChangeDeckName, onChangeGameName, onChangeDescription);
                    }}
                >
                    <Text style={styles.textStyle}>OK</Text>
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
                        setDeckModalVisible(!deckModalVisible);
                    }}
                >
                </Modal>
                    </View>
                    {deckModalVisible && (
                        <Modal
            animationType="fade"
            transparent={true}
            visible={deckModalVisible}
            onRequestClose={() => {
                setDeckModalVisible(false);
            }}
                >
                    <View style={styles.centeredDeckView}>
                        <View style={styles.backButton}>
                            <Pressable onPress={() => setDeckModalVisible(false)}>
                                <AntDesign name="close" size={24} color="black" />
                            </Pressable>
                            
                            <View>

                                <View style={styles.paddedView}> 
                                    <Text style={styles.logoText}>LOGO</Text>
                                </View>

                                <View style={styles.line}></View>

                                <View style={styles.deckContainer}>
                                    <Text style={styles.titleText} >{currentDeck.name}</Text>
                                </View>
                                
                                <View style={styles.deckContainer}>
                                    <Text style={styles.subHeading}>Game: {currentDeck.game}</Text>
                                </View>
                            
                                <View style={styles.deckDescription}>
                                    <Text>Description:      </Text>
                                    <Text>     </Text>
                                    <Text>      {currentDeck.description}</Text>
                                </View>

                                <View style={styles.line}></View>
                                <Text style={styles.CText}>CARDS:  </Text>
                                    {/* Render the cards */}
                                <FlatList
                                    data={deckCards}
                                    renderItem={({ item }) => (
                                        <Text>{item.id}</Text>
                                    )}
                                    keyExtractor={item => item.id.toString()}
                                />

                                

                            </View>
                        </View>
                        <View style={styles.deckButtonSpace}>
                            {/* <Pressable onPress={() => setModalVisible(true)}>
                                 <View style={[styles.button, styles.deckButton]}>
                                    <Text style={styles.buttonText}>+ Add Card</Text>
                                </View>
                            </Pressable>
                            <Pressable onPress={() => setModalVisible(true)}>
                                 <View style={[styles.button, styles.deckButton]}>
                                    <Text style={styles.buttonText}> Delete Deck</Text>
                                </View>
                            </Pressable> */}
                        </View>
                    </View>
                </Modal>
                            )}     
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: 'center',
        justifyContent: 'center',
    },
    paddedView: {
        padding: 50, 
        // paddingTop: 10,
        // paddingRight: 15,
        // paddingBottom: 5,
         paddingLeft: 115,
      },
      paddedViewLEFT: {
        padding: 10, 
         paddingTop: 20,
        // paddingRight: 15,
        // paddingBottom: 5,
         paddingLeft: 0
         ,
      },
      line: {
        borderBottomColor: 'black', 
        borderBottomWidth: 1, 
        marginVertical: 0, 
        marginLeft: -20, 
        marginRight:-60,
      },
    deckGrid: {
        flex: 12,
        padding: 10,
    },
    deckButtonSpace: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 10,
        padding: 0,
        right: 10,
    },
    cardsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
      },
      cardList: {
        flexGrow: 0, 
      },
      cardName: {
        fontSize: 16,
        marginVertical: 5,
        textAlign: 'center',
      },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    }, 
    deckInfo: {
        fontSize: 16, // Slightly smaller font size for game and description
        color: '#555', // A slightly lighter color for subtext
        lineHeight: 24, // Enough space between lines of text
        paddingVertical: 2, // Less vertical padding for subtext
        paddingHorizontal: 10, // Maintain consistent horizontal padding
        textAlign: 'left', // Align text to the left for these elements
      },
      deckDescription: {
        fontSize: 14, // Even smaller font size for the description if it's longer
        color: '#777', // A lighter color for less important information
        lineHeight: 20, // Adequate space between lines of text
        paddingVertical: 2,
        paddingHorizontal: 10,
        textAlign: 'left',
      },
    logoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 10,
    }, 
    CText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 10,
        paddingTop: 20,
    }, 
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 10,
        marginLeft: 10,

    }, 
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
        backgroundColor: '#350023',
        flexDirection: 'row', // Aligns children (buttons) in a horizontal row
    justifyContent: 'space-evenly', // Evenly distributes buttons across the container
    alignItems: 'center', // Centers buttons vertically
    position: 'absolute', // Positions the container absolutely to the parent view
    bottom: 0, // Aligns the container to the bottom of the parent view
    left: 0, // Aligns the container to the left of the parent view
    right: 0, // Aligns the container to the right of the parent view
    padding: 10,
    },
    buttonClose: {
        backgroundColor: '#350023',
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
    addButton: {
        backgroundColor: '#350023', // Magenta color
        padding: 15,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    inputBox: {
        borderWidth: 2,
        width: 150,
        height: 25,
        alignItems: "center",
        marginVertical: 8,
        marginHorizontal: 8,
        borderColor: 'black',
        borderRadius: 10,
    },
    centeredDeckView: {
        flex: 1,
        backgroundColor: 'white', 
        margin: 5, 
        marginTop: 100, 
        marginBottom: 0, 
        borderRadius: 40, 
        overflow: 'hidden', 
        borderColor: 'grey', 
        borderWidth: 5, 
    },
    backButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 10,
        alignSelf: 'left',
        padding: 10,
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
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    opaqueBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
    },
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: '#ffffff',
        },
        heading: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        subHeading: {
            fontSize: 18,
            marginBottom: 10,
            marginLeft: 10,
        },
        description: {
            fontSize: 16,
        },
    
});