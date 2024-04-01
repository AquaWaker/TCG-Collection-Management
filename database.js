import * as SQLite from 'expo-sqlite';

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
                    console.log('Database initialized');
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
                    // if (result.insertId > 0) {
                    //     console.log(`Card "${card.name}" inserted successfully`);
                    // } else {
                    //     console.log(`Card "${card.name}" already exists, skipping insertion`);
                    // }
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

export const getAllCards = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM cards',
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