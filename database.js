import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydb.db');

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
                () => { resolve(); },
                (_, error) => { reject(error); }
            );
        });
    });
};

export const insertCard = (card) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO cards
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
                (_, result) => { resolve(result); },
                (_, error) => { reject(error); }
            );
        });
    });
};

export const getAllItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM cards',
                [],
                (_, result) => { resolve(result); },
                (_, error) => { reject(error); }
            );
        });
    });
};