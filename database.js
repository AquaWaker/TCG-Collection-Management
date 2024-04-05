import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

const db = SQLite.openDatabase('mydb.db');

// comment out line 3 and uncomment this to
// make db globally accessible for debugging purposes
// window.db = SQLite.openDatabase('mydb.db');

export const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS cards (
                    id INTEGER PRIMARY KEY,
                    name TEXT,
                    setid TEXT,
                    description TEXT,
                    details TEXT,
                    cost INTEGER,
                    copies INTEGER,
                    image TEXT,
                    price TEXT
                )`,
                [],
                () => {
                    //console.log('Database initialized');
                    resolve();
                },
                (_, error) => {
                    console.error('Error initializing database:', error);
                    reject(error);
                }
            );
        });
    });
};

export const deleteDeck = (deckId, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            `DELETE FROM decks WHERE id = ?;`,
            [deckId],
            (_, result) => {
                console.log('Deck deleted successfully');
                callback(true);
            },
            (_, error) => {
                console.error('Failed to delete deck:', error);
                callback(false);
                return true; 
            }
        );
    });
};

export const insertCard = (card) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT OR IGNORE INTO cards
                (id, name, setid, description, details, cost, copies, image, price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    card.id,
                    card.name,
                    card.setid,
                    card.description,
                    JSON.stringify(card.details),
                    card.cost,
                    card.copies,
                    card.image,
                    card.price
                ],
                (_, result) => {
                    if (result.insertId > 0) {
                       // console.log(`Card "${card.name}" inserted successfully`);
                    } else {
                       // console.log(`Card "${card.name}" already exists, skipping insertion`);
                    }
                    resolve(result);
                },
                (_, error) => {
                    console.error(`Error inserting card "${card.name}":`, error);
                    reject(error);
                }
            );
        });
    });
};

// export const getCardsForDeck = (deckId) => {
//     return new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             tx.executeSql(
//                 `SELECT c.* FROM cards c
//                 JOIN deck_cards dc ON c.id = dc.card_id
//                 WHERE dc.deck_id = ?`,
//                 [deckId],
//                 (_, result) => {
//                     const cards = [];
//                     for (let i = 0; i < result.rows.length; i++) {
//                         cards.push(result.rows.item(i).stringify);
//                     }
//                     //console.log(`Cards for deck ${deckId} fetched successfully`);
//                     //console.log(`Cards: ${cards}`);
//                     resolve(cards);
//                 },
//                 (_, error) => {
//                     console.error(`Error fetching cards for deck ${deckId}:`, error);
//                     reject(error);
//                 }
//             );
//         });
//     });
// };

export const insertCardToDeck = (item, deckId) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            // Step 1: Check if the card already exists in the 'cards' table
            tx.executeSql(
                `SELECT * FROM cards WHERE id = ?`,
                [item.id],
                (_, result) => {
                    // Step 2: If the card doesn't exist, insert it into the 'cards' table
                    if (result.rows.length === 0) {
                        tx.executeSql(
                            `INSERT INTO cards (id, name, setid, cost, copies, image, price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [item.id, item.name, item.setid, item.cost, item.copies, item.image, item.price],
                            () => console.log('Card inserted'),
                            (_, error) => reject(`Failed to insert card: ${error}`)
                        );
                    }
                    tx.executeSql(
                        `SELECT * FROM deck_cards WHERE deck_id = ? AND card_id = ?`,
                        [deckId, item.id],
                        (_, linkResult) => {
                            // Step 4: If the card is not linked, link it to the deck
                            if (linkResult.rows.length === 0) {
                                tx.executeSql(
                                    `INSERT INTO deck_cards (deck_id, card_id) VALUES (?, ?)`,
                                    [deckId, item.id],
                                    () => resolve(`Card linked to deck`),
                                    (_, linkError) => reject(`Failed to link card to deck: ${linkError}`)
                                );
                            } else {
                                resolve('Card already linked to deck');
                            }
                        },
                        (_, checkLinkError) => reject(`Failed to check if card is linked to deck: ${checkLinkError}`)
                    );
                },
                (_, checkError) => reject(`Failed to check if card exists: ${checkError}`)
            );
        });
    });
};



export const getAllCards = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM cards',
                [],
                (_, result) => {
                    console.log('Cards fetched successfully');
                    resolve(result);
                },
                (_, error) => {
                    console.error('Error fetching cards:', error);
                    reject(error);
                }
            );
        });
    });
};

export const searchCards = (name, filters) => {
    var databaseSearch = 'SELECT * FROM cards ';
    var addAnd = 0;

    if (name != "") {
        databaseSearch += 'WHERE name = ' + name;
        addAnd = 1;
    }

    // if (filters.game != null) {
    //     if (addAnd == 1) {
    //         databaseSearch += ' AND '
    //     }
    //     databaseSearch += 'WHERE game = ' + filters.game;
    //     addAnd = 1;
    // }

    if (filters.id != null) {
        if (addAnd == 1) {
            databaseSearch += ' AND '
        }
        databaseSearch += 'WHERE setid = ' + filters.id;
        addAnd = 1;
    }

    if (filters.price != -1) {
        if (addAnd == 1) {
            databaseSearch += ' AND '
        }
        databaseSearch += 'WHERE price ' + filters.operation + ' ' + filters.price ;
        addAnd = 1;
    }

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                databaseSearch,
                [],
                (_, result) => {
                    // console.log('Cards fetched successfully');
                    resolve(result);
                },
                (_, error) => {
                    console.error('Error fetching cards:', error);
                    reject(error);
                }
            );
        });
    });
}

export const deleteAllCards = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM cards',
                [],
                (_, result) => {
                    // console.log('All cards deleted successfully');
                },
                (_, error) => {
                    console.error('Error deleting cards:', error);
                }
            );
        });
    });
}
export const getAllDecks = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM decks',
                [],
                (_, result) => {
                    resolve(result.rows._array);
                },
                (_, error) => {
                    console.error('Error fetching decks:', error);
                    reject(error);
                }
            );
        });
    });
};

// export const insertDeck = (deck, cards) => {
//     return new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             tx.executeSql(
//                 `INSERT INTO decks (name, game, description)
//                 VALUES (?, ?, ?)`,
//                 [deck.name, deck.game, deck.description],
//                 (tx, result) => {
//                     const deckId = result.insertId;
//                     //console.log(`Deck "${deck.name}" inserted successfully with ID: ${deckId}`);

//                     cards.forEach((card, index) => {
//                         tx.executeSql(
//                             `INSERT OR IGNORE INTO deck_cards (deck_id, card_id, copies)
//                             VALUES (?, ?, ?)`,
//                             [deckId, card.id, card.copies],
//                             () => {
//                                 if (index === cards.length - 1) {
//                                     //console.log(`All cards associated with deck "${deck.name}" inserted successfully.`);
//                                 }
//                             },
//                             (_, error) => reject(error)
//                         );
//                     });
//                     resolve(result);
//                 },
//                 (_, error) => reject(error)
//             );
//         });
//     });
// };
export const insertDeck = (deck, cards) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO decks (name, game, description) VALUES (?, ?, ?)`,
                [deck.name, deck.game, deck.description],
                (tx, deckResult) => {
                    const deckId = deckResult.insertId;
                    cards.forEach(card => {
                        // Check if the card already exists in the cards table
                        tx.executeSql(
                            `SELECT id FROM cards WHERE name = ?`,
                            [card.name],
                            (tx, cardSelectResult) => {
                                if (cardSelectResult.rows.length > 0) {
                                    const cardId = cardSelectResult.rows.item(0).id;
                                    // Card exists, now link it to the deck
                                    tx.executeSql(
                                        `INSERT INTO deck_cards (deck_id, card_id, copies) VALUES (?, ?, ?)`,
                                        [deckId, cardId, card.copies],
                                        //() => console.log(`Linked existing card ID ${card.name} to new deck ID ${deckId}`)
                                    );
                                } else {
                                    // Card doesn't exist, insert the card and then link it
                                    tx.executeSql(
                                        `INSERT INTO cards (name, setid, id, cost, image, price) VALUES (?, ?, ?, ?, ?, ?)`,
                                        [card.name, card.setid, card.id, card.cost, card.image, card.price],
                                        (tx, cardInsertResult) => {
                                            tx.executeSql(
                                                `INSERT INTO deck_cards (deck_id, card_id, copies) VALUES (?, ?, ?)`,
                                                [deckId, cardInsertResult.insertId, card.copies]
                                            );
                                        }
                                    );
                                }
                            }
                        );
                    });
                    resolve(deckResult);
                },
                (tx, error) => reject(error)
            );
        });
    });
};


export const getCardNamesForDeck = (deckId) => {
    return new Promise((resolve, reject) => {
        console.log(`Fetching cards for deck ID: ${deckId}`); // Log the deckId
        db.transaction(tx => {
            tx.executeSql(
                `SELECT c.name FROM cards c 
                 INNER JOIN deck_cards dc ON c.id = dc.card_id 
                 WHERE dc.deck_id = ?`,
                [deckId],
                (tx, results) => {
                    console.log(`Query returned ${results.rows.length} results`); // Log number of results
                    let cardNames = [];

                    for (let i = 0; i < results.rows.length; i++) {
                        cardNames.push(results.rows.item(i).name);
                    }

                    if (cardNames.length > 0) {
                        console.log(`Card names: ${cardNames.join(', ')}`); // Log card names
                    } else {
                        console.log('No cards found for this deck.'); // Log if no cards found
                    }

                    const cardNamesString = cardNames.join(', ');
                    resolve(cardNamesString);
                },
                (tx, error) => {
                    console.error('Query failed:', error); // Log if query fails
                    reject(error);
                }
            );
        });
    });
};





export const addNewDeckDB = (DeckName, GameName, Description, setModalVisible, refreshDecks, onChangeDeckName, onChangeGameName, onChangeDescription) => {
    // Check if the deck name already exists
    getAllDecks().then(decks => {
        const isDuplicate = decks.some(deck => deck.name === DeckName);
        if (isDuplicate) {
            Alert.alert('Error', 'Deck name must be unique. Please choose a different name.');
            return;
        }

        // If not a duplicate, proceed with inserting the new deck
        insertDeck({ name: DeckName, game: GameName, description: Description }, [])
            .then(() => {
                setModalVisible(false); // Close the modal
                refreshDecks(); // Refresh the decks list
                onChangeDeckName(''); // Reset deck name input
                onChangeGameName(''); // Reset game name input
                onChangeDescription(''); // Reset description input
                Alert.alert('Success', 'New deck added successfully.');
            })
            .catch(error => {
                console.error('Failed to add new deck:', error);
                Alert.alert('Error', 'Failed to add new deck. Please try again.');
            });
    }).catch(error => {
        console.error('Error fetching decks:', error);
        Alert.alert('Error', 'Failed to fetch existing decks. Please try again.');
    });
};

const addNewDeck = () => {
    setModalVisible(true);
};

