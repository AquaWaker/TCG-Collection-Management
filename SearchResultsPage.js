import React, {useEffect, useState} from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    ImageBackground,
    Pressable,
    TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);
import { searchCards, getAllCards } from './database';

import { useFilters } from './FiltersContext';

export const SearchResultsPage = () => {

    const [searchQuery, onChangeSearchQuery] = React.useState('Search');
    const [viewLayout, setViewLayout] = React.useState('grid');
    const [modalVisible, setModalVisible] = useState(false);
    const [currentCard, setCurrentCard] = useState(require('./empty_card.json'));
    
    const navigation = useNavigation();
 
    const placeholderImage = require('./assets/wireframe.png');
    const [cards, setCards] = useState([]);
    const { filters, changeFilters } = useFilters();

    const fetchCards = (filters) => {
        return new Promise((resolve, reject) => {
            searchCards(filters)
                .then(result => {
                    var cards = result.rows._array.map(card => ({
                        ...card,
                        details: JSON.parse(card.details)
                    }));
                    setCards(cards);
                    resolve();
                })
                .catch(error => {
                    console.error('Error fetching items:', error);
                    reject(error);
                });
        });
    }

    useEffect(() => {
        fetchCards(filters);
    })

    const onSubmitSearch = () => {
        changeFilters({
            name: searchQuery,
            game: null,
            id: null,
            price: '-1',
            operation: "=",
        });

        navigation.navigate("SEARCH RESULTS");
    }

    const popupModal = (card) => {
        setCurrentCard(card);
        setModalVisible(true);
    }

    const ResultRow = ({card}) => {
        return (
            <Pressable onPress={() => popupModal(card)}>
                <View style={styles.resultRow}>
                    <View style={styles.resultRowThumbnailView}>
                        <ImageBackground
                            style={styles.cardThumbnail}
                            source={card.image ? {uri: card.image} : placeholderImage}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={styles.resultRowCardInfo}>
                        <Text style={styles.cardTitle}>{card.name}</Text>
                        <Text style={styles.cardSubtitle}>({card.setid}) {card.id}</Text>
                    </View>
                </View>
            </Pressable>
        );
    };

    const ResultGrid = ({card}) => {
        return (
            <View style={styles.resultGridThumbnailView}>
                <Pressable onPress={() => popupModal(card)}>
                    <ImageBackground
                        style={styles.cardThumbnail}
                        source={card.image ? {uri: card.image} : placeholderImage}
                        resizeMode='cover'
                    />
                </Pressable>
            </View>
        )
    };

    const CardModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalView}>
                    <Pressable
                        onPress={() => setModalVisible(false)}
                        style={styles.modalCloseButton}
                    >
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </Pressable>

                    <View style={styles.modalSummaryView}>
                        <View style={styles.modalThumbnailView}>
                            <ImageBackground
                                style={styles.cardThumbnail}
                                source={currentCard.image ? { uri: currentCard.image} : placeholderImage}
                                resizeMode='cover'
                            />
                        </View>

                        <View style={styles.modalSummaryTextView}>
                            <Text style={styles.modalCardTitle}>{currentCard.name}</Text>
                            <Text style={styles.modalCardSubtitle}>
                                {currentCard.description ? currentCard.description : "N/A"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.modalDividerLine}/>

                    <View style={styles.modalDetailsView}>
                        <View style={styles.modalTextView}>
                            <Text style={styles.modalCardText}>
                                Cost: {currentCard.cost}
                            </Text>
                        </View>

                        {
                            currentCard.details && currentCard.details.map((detail) => (
                                detail ? (
                                    <View style={styles.modalTextView}>
                                        <Text style={styles.modalCardText}>{detail}</Text>
                                    </View>
                                ) : null
                            )) 
                        }
                    </View>

                    <View style={styles.modalDividerLine}/>

                    <View style={styles.modalPurchaseView}>
                        <View style={styles.modalTextView}>
                            <Text style={styles.modalCardText}>
                                Price: {currentCard.price}
                            </Text>
                            <Text style={styles.modalCardText}>|</Text>
                            <Text style={styles.modalCardText}>
                                Copies: {currentCard.copies}
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            { cards.length == 0 
                ?   <Text style={{
                        fontSize: 30,
                        fontWeight: '500',
                        color: 'gray',
                        textAlign: 'center',
                    }}>
                        No Cards Stored
                    </Text>
                :   <View style={styles.container}>
                        <CardModal/>
                        <View style={styles.layoutOptions}>
                            <TouchableOpacity onPress={() => setViewLayout('grid')}>
                                <Entypo name="grid" size={40} color={viewLayout=='grid' ? '#247BA0' : 'black'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setViewLayout('row')}>
                                <Ionicons name="reorder-three" size={40} color={viewLayout=='row' ? '#247BA0' : 'black'} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.resultList}>
                            { viewLayout == 'row'
                                ? <FlatList
                                    key={'rowList'}
                                    data={cards}
                                    renderItem={({ item }) => 
                                        <ResultRow card={item}/>
                                    }
                                />
                                : <FlatList
                                    key={'gridList'}
                                    data = {cards}
                                    numColumns={2}
                                    renderItem={({ item }) => 
                                        <View style={styles.resultGrid}>
                                            <ResultGrid card={item}/>
                                        </View>
                                    }
                                />
                            }
                        </View>
                        <View style={styles.inputBoxContainer}>
                            <TextInput
                                style={styles.inputBox}
                                onChangeText={onChangeSearchQuery}
                                onSubmitEditing={onSubmitSearch}
                                value={searchQuery}
                                placeholder="Search"
                            />
                            <View>
                            {/* Insert search filters here */}
                            </View>
                        </View>
                    </View>
            }
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    },
    resultList: {
        flex: 1,
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
    },
    resultRow: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 160,
        paddingVertical: 22,
        paddingHorizontal: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultGrid: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
    },
    resultRowThumbnailView: {
        width: '25%',
        height: '100%',
        marginRight: 20,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    resultGridThumbnailView: {
        width: 135,
        height: 180,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 20,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    cardThumbnail: {
        width: '100%',
        height: '100%',
    },
    resultRowCardInfo: {
        width: '65%',
        height: '100%',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '500',
    },
    cardSubtitle: {
        fontSize: 16,
        fontWeight: '400',
    },
    modalCardTitle: {
        paddingBottom: 10,
        fontSize: 20,
        fontWeight: '600',
        color: 'white'
    },
    modalCardSubtitle: {
        fontStyle: 'italic',
        fontSize: 14,
        fontWeight: '400',
        color: 'white'
    },
    modalCardText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'white',
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    layoutOptions: {
        flexDirection: 'row',
        width: '100%',
        height: '5%',
        justifyContent: 'flex-end',
    },
    layoutButton: {
        width: '100%',
        height: '100%',
    },
    modalView: {
        width: '100%',
        height: '75%',
        backgroundColor: '#BBA5B0',
        padding: 10,
        marginTop: 90,
    },
    modalCloseButton: {
        width: '7%',
        marginBottom: 10,
    },
    modalSummaryView: {
        flexDirection: 'row',
        height: '30%',
    },
    modalSummaryTextView: {
        width: '70%',
        height: '100%',
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    modalDetailsView: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    modalPurchaseView: {
        justifyContent: 'center',
    },
    modalTextView: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalThumbnailView: {
        width: '33%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 15,
        backgroundColor: 'white',
    },
    modalDividerLine: {
        marginVertical: 20,
        height: 1,
        backgroundColor: 'white',
    },
    inputBoxContainer: {
        width: '90%',
    },
    inputBox: {
        borderWidth: 2,
        width: '100%',
        height: 50,
        alignItems: 'center',
        marginVertical: 8,
        paddingHorizontal: 10,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});