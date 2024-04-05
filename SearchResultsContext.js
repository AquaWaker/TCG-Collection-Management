import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    useState,
    useEffect,
    createContext,
    useContext
} from 'react';

import { searchCards } from './database';

const SearchResultsContext = createContext();

export const useResults = () => useContext(SearchResultsContext);

export const SearchResultsProvider = ({ children }) => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const retrieveResults = async () => {
            try {
                const value = await AsyncStorage.getItem('results');
                if (value !== null) {
                    setResults(JSON.parse(value));
                }
            } catch (error) {
                console.log('Error retrieving results:', error);
            }
        };

        retrieveResults();
    }, []);

    const updateResults = async (results) => {
        setResults(results);

        try {
            await AsyncStorage.setItem('results', JSON.stringify(results));
        } catch (error) {
            console.log('Error updating results:', error);
        }
    };

    const searchResults = async (filters) => {
        searchCards(filters)
            .then((result) => {
                var results = result.rows._array.map(card => ({
                    ...card,
                    details: JSON.parse(card.details)
                }));

                updateResults(results);
            })
            .catch((error) => {
                updateResults([]);
                // console.error('Error searching results: ', error);
            });
    };

    const resetResults = async () => {
        updateResults([]);
    };

    return (
        <SearchResultsContext.Provider value={{
            results,
            updateResults,
            searchResults,
            resetResults
        }}>
            {children}
        </SearchResultsContext.Provider>
    );
};