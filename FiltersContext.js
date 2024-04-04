import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    useState,
    useEffect,
    createContext,
    useContext
} from 'react';

const FiltersContext = createContext();

export const useFilters = () => useContext(FiltersContext);

export const FiltersProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        name: "",
        game: null,
        id: null,
        price: '-1',
        operation: "=",
    });

    useEffect(() => {
        const retrieveFilters = async () => {
            try {
                const value = await AsyncStorage.getItem('filters');
                if (value !== null) {
                    setFilters(JSON.parse(value));
                }
            } catch (error) {
                console.log('Error retrieving filters:', error);
            }
        };

        retrieveFilters();
    }, []);

    const changeFilters = async (filters) => {
        setFilters(filters);

        try {
            await AsyncStorage.setItem('filters', JSON.stringify(filters));
        } catch (error) {
            console.log('Error updating filters:', error);
        }
    };

    return (
        <FiltersContext.Provider value={{ filters, changeFilters }}>
            {children}
        </FiltersContext.Provider>
    );
};