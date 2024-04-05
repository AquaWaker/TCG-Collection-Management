import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, View, Image,SafeAreaView, FlatList, Pressable, TextInput, ImageBackground } from 'react-native';
import { AntDesign,MaterialIcons ,FontAwesome } from '@expo/vector-icons';
import { getAllDecks, addNewDeckDB, addNewDeck} from './database';
import { useNavigation } from '@react-navigation/native';
import { getCardsForDeck } from './database';
import { getCardNamesForDeck } from './database'; 
import { deleteDeck } from './database'; 
import { getAllCards } from './database'; 
import { insertCard, insertCardToDeck } from './database'; 



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

    const placeholderImage = require('./assets/wireframe.png');

    const addNewDeck = () => {
        setModalVisible(true);
    };
    
    const [cards, setCards] = useState([]);
    const [showCards, setShowCards] = useState(false);
    const [logMessage, setLogMessage] = useState('');

    const deckPopupSetup = (deck) => {
        setCurrentDeck(deck);
        setModalVisible(false);
        setDeckModalVisible(true);
        getCardNamesForDeck(deck.id)
            .then(cardNamesString => {
                // Log the card names for the selected deck
                if (cardNamesString.trim().length === 0) {
                    // If it's empty, set the log message to indicate no cards in the deck
                    
                    setLogMessage(`No cards in deck '${deck.name}'`);
                } else {
                    // If there are card names, construct the log message with those names
                    const namesWithNewLines = cardNamesString.replace(/, /g, '\n');
                    const message = `${namesWithNewLines}`;
                    setLogMessage(message);

                }
            })
            .catch(error => {
                console.error(`Error fetching card names for deck '${deck.name}':`, error);
            });

    };    

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#BBA5B0' }]}>
            <View style={styles.deckGrid}>
                <FlatList
                    data={decks}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => deckPopupSetup(item)}>
                            <View style={styles.opaqueBox}>
                                <View style={styles.deckBox}>
                            
                                    <Image
                                        source={placeholderImage}
                                        style={{ width: 80, height: 80,  paddingRight: 10 }} // Adjust the width and height as needed
                                    />
                             
                                    <View>
                                        <Text style={{ paddingLeft: 50, fontWeight: 'bold'}}>{item.name}</Text>
                                        <Text style={{ paddingLeft: 50 }}>{item.game}</Text>
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
                    <View style={[styles.centeredView]}>
                        <View style={styles.modalView}>

                            <TextInput
                                style={styles.inputTitles}
                                onChangeText={onChangeDeckName}
                                value={DeckName}
                                placeholder="Deck Name"
                            />
                            <TextInput
                                style={styles.inputTitles}
                                onChangeText={onChangeGameName}
                                value={GameName}
                                placeholder="Game Name"
                            />
                            <TextInput
                                style={styles.inputTitles}
                                onChangeText={onChangeDescription}
                                value={Description}
                                placeholder="Description"
                            />
                          <View style={{ flexDirection: 'row' , paddingTop:25}}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    addNewDeckDB(DeckName, GameName, Description, setModalVisible, refreshDecks, onChangeDeckName, onChangeGameName, onChangeDescription);
                                }}
                            >
                                <Text style={[styles.textStyle]}>ADD DECK</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>CANCEL</Text>
                            </Pressable>
                        </View>

                        </View>
                    </View>
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
                    <View style={[styles.centeredDeckView,{ backgroundColor: 'lightgrey' }]}>
                        <View style={styles.backButton}>
                            <Pressable onPress={() => setDeckModalVisible(false)}>
                                <AntDesign name="close" size={24} color="black" />
                            </Pressable>
                            
                            <View>

                                <View style={styles.paddedView}> 
                                    <Image
                                        source={placeholderImage}
                                        style={{ width: 110, height: 110 }} // Adjust the width and height as needed
                                    />
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
                                
                                <View style={{paddingTop: 40, justifyContent: 'center', height: 275,}}>
                                    {showCards ? (
                                        <View style={{
                                            backgroundColor: '#350023',
                                            borderRadius: 10,
                                            overflow: 'hidden',
                                        }}>
                                            <Text style={{
                                                width: '100%',
                                                fontSize: 20,
                                                fontWeight: 'bold',
                                                color: 'white',
                                                textAlign: 'center',
                                                paddingTop: 10,
                                            }}>
                                                ADD NEW CARD
                                            </Text>
                                            <FlatList
                                                data={cards}
                                                renderItem={({ item }) => {
                                                    //console.log('Rendering item:', item);
                                                    return (
                                                        <View style={styles.cardItem}>
                                                            <Pressable onPress={() => {
                                                            insertCardToDeck(item, currentDeck.id)
                                                                .then(() => {
                                                                    //console.log('Card added to deck successfully');
                                                                    refreshDecks();
                                                                    setDeckModalVisible(false)
                                                                    setShowCards(false);

                                                                // Show a success alert
                                                                Alert.alert(
                                                                    "Success",
                                                                    "Card added to deck successfully",
                                                                    [{ text: "OK" }]
                                                                );
                                                                })
                                                                .catch((error) => {
                                                                    console.error('Failed to add card to deck:', error);
                                                                });
                                                        }}>
                                                                <ImageBackground source={{ uri: item.image }} style={styles.cardImage} />
                                                            </Pressable>
                                                        </View>
                                                    );
                                                }}
                                                keyExtractor={item => {
                                                    // console.log('Item key:', item.id);
                                                    return item.id.toString();
                                                }}
                                                numColumns={2} 
                                                contentContainerStyle={styles.grid}
                                            />
                                        </View>
                                    
                                    )
                                    : <Text style={{ paddingLeft: 50, fontWeight: 'bold', fontSize: 18}}>{logMessage}</Text>
                                }
                                </View>
                            </View>
                            
                        </View>
                        <View style={styles.deckActionButtons}>
                        <Pressable
                            style={[styles.button, styles.addCardButton]}
                            onPress={() => {
                                console.log("add button was pushed")
                                if (showCards) {
                                    setShowCards(false);
                                } else {
                                    getAllCards()
                                        .then(result => {
                                            console.log("Dummy fetch");
                                            setCards(result.rows._array); // Even with dummy data for now
                                            setShowCards(true);
                                        })
                                        .catch(error => {
                                            console.error('Error fetching items:', error);
                                        });
                                }
                                
                            }}
                        >
                        
                            <Text style={styles.textStyle}> ADD CARD </Text>
                        </Pressable>
                        
                                <Pressable
                                    style={[styles.button, styles.addCardButton]} // Use existing styles or create new ones as needed
                                    onPress={() => {
                                        deleteDeck(currentDeck.id, (success) => {
                                        if (success) {
                                            console.log('Deck deletion successful');
                                            setDeckModalVisible(false);
                                            refreshDecks();
                                        } else {
                                            console.error('Failed to delete the deck');
                                        }
                                    });
                                }}
                                >
                                    <Text style={styles.textStyle}>DELETE DECK</Text>
                                </Pressable>
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
    cardItem: {
        flex: 1,
        margin: 10,
        width: 150,
        height: 200,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 3,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%', // Adjust size as needed
        height: '100%', // Adjust size as needed
    },
    grid: {
        paddingBottom: 20, // Add padding at the bottom of the grid
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
        marginLeft: -50, 
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
      deleteDeckButton: {
        backgroundColor: '#350023', 
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 2, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.25, 
        shadowRadius: 3.84, 
    },
    deckActionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        position: 'absolute', 
        bottom: 0, 
        left: 0,
        right: 0,
        paddingBottom: 20, 
    },
    addCardButton: {
        backgroundColor: '#350023', // A green color for the add button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 2, // Adds a shadow for Android
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
        shadowOpacity: 0.25, // Shadow opacity for iOS
        shadowRadius: 3.84, // Shadow radius for iOS
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
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
        fontSize: 28,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 10,
        paddingTop: 20,
        paddingLeft: 5,
    }, 
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 10,
        marginLeft: 10,
        paddingTop: 5,

    }, 
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
        padding: 55,
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
        flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    alignItems: 'center',
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
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
    textStyleXbutton: {
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
        fontSize: 35,
        textAlign: 'left',
        color: 'white',
        fontWeight: 'bold',
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