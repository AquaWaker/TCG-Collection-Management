import React, {useState} from 'react';
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
    TextInput,
    ScrollView
} from 'react-native';
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop.']);

import { useFilters } from './FiltersContext';
import { useResults } from './SearchResultsContext';
import { insertCard } from './database';

export const SearchResultsPage = () => {

    const [searchQuery, onChangeSearchQuery] = React.useState('');
    const [viewLayout, setViewLayout] = React.useState('grid');
    const [cardInfoVisible, setCardInfoModalVisible] = useState(false);
    const [addCardVisible, setAddCardVisible] = useState(false);
    const [currentCard, setCurrentCard] = useState(require('./empty_card.json'));

    const placeholderImage = require('./assets/wireframe.png');
    const { results, searchResults } = useResults();
    const { changeFilters } = useFilters();

    const onSubmitSearch = () => {
        const newFilters = {
            name: searchQuery,
            game: null,
            id: '',
            price: '-1',
            operation: "=",
        }
        changeFilters(newFilters);
        searchResults(newFilters);
    }

    const popupCardInfoModal = (card) => {
        setCurrentCard(card);
        setCardInfoModalVisible(true);
    }

    const popupAddCardModal = () => {
        setAddCardVisible(true);
    }

    const ResultRow = ({card}) => {
        return (
            <Pressable onPress={() => popupCardInfoModal(card)}>
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
                <Pressable onPress={() => popupCardInfoModal(card)}>
                    <ImageBackground
                        style={styles.cardThumbnail}
                        source={card.image ? {uri: card.image} : placeholderImage}
                        resizeMode='cover'
                    />
                </Pressable>
            </View>
        )
    };

    const CardInfoModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={cardInfoVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setCardInfoModalVisible(false);
                }}
            >
                <View style={styles.modalView}>
                    <Pressable
                        onPress={() => setCardInfoModalVisible(false)}
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

    const AddCardModal = () => {
        const [title, setTitle] = useState("");
        const [id, changeId] = useState("");
        const [setId, changeSetId] = useState("");
        const [cost, setCost] = useState(0);
        const [copies, setCopies] = useState(0);
        const [game, setGame] = useState("");
        const [price, setPrice] = useState("");
        const [description, setDescription] = useState("");
        const [details, setDetails] = useState("");

        function addNewCard() {
            var card = {
                name: title,
                id: id,
                setId: setId,
                cost: cost,
                copies: copies,
                game: game,
                price: price,
                description: description,
                details: [details],
                image: undefined,
            }
            console.log(card);

            insertCard(card);
            setAddCardVisible(false);
        }

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={addCardVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setAddCardVisible(false);
                }}
            >
                <View style={styles.modalView}>
                    <Pressable
                        onPress={() => setAddCardVisible(false)}
                        style={styles.modalCloseButton}
                    >
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </Pressable>

                    <View style={{
                        width: '100%',
                        alignItems: 'center'
                    }}>
                        <Text style={[
                            styles.modalCardTitle,
                            {fontSize: 25}
                        ]}>
                            ADD NEW CARD
                        </Text>
                    </View>

                    <View style={styles.modalDividerLine}/>
                    
                    <View style={[styles.modalSummaryView, {flex: 1}]}>
                        <ScrollView style={[
                            styles.modalSummaryTextView,
                            {width: '100%'}
                        ]}>
                            <Text style={styles.modalCardTitle}>Title</Text>
                            <TextInput
                                style={[styles.addCardInput]}
                                onChangeText={setTitle}
                                placeholderTextColor={'black'}
                                value={title}
                                placeholder='Enter...'
                            />

                            <Text style={styles.modalCardTitle}>Card ID</Text>
                            <TextInput
                                style={[
                                    styles.addCardInput,
                                    {width: '20%'}
                                ]}
                                onChangeText={changeId}
                                placeholderTextColor={'black'}
                                value={id}
                                placeholder='Enter...'
                            />

                            <Text style={styles.modalCardTitle}>Set ID</Text>
                            <TextInput
                                style={[
                                    styles.addCardInput,
                                    {width: '20%'}
                                ]}
                                onChangeText={changeSetId}
                                placeholderTextColor={'black'}
                                value={setId}
                                placeholder='Enter...'
                            />

                            <Text style={styles.modalCardTitle}>Cost</Text>
                            <TextInput
                                style={[
                                    styles.addCardInput,
                                    {width: '20%'}
                                ]}
                                onChangeText={setCost}
                                keyboardType='numeric'
                                placeholderTextColor={'black'}
                                value={cost}
                                placeholder='0'
                            />

                            <Text style={styles.modalCardTitle}>Copies</Text>
                            <TextInput
                                style={[
                                    styles.addCardInput,
                                    {width: '20%'}
                                ]}
                                keyboardType='numeric'
                                placeholderTextColor={'black'}
                                onChangeText={setCopies}
                                value={copies}
                                placeholder='0'
                            />
                            
                            <Text style={styles.modalCardTitle}>Game</Text>
                            <TextInput
                                style={[styles.addCardInput]}
                                onChangeText={setGame}
                                placeholderTextColor={'black'}
                                value={game}
                                placeholder='Enter...'
                            />

                            <Text style={styles.modalCardTitle}>Price</Text>
                            <TextInput
                                style={[styles.addCardInput]}
                                onChangeText={setPrice}
                                placeholderTextColor={'black'}
                                value={price}
                                placeholder='Enter...'
                            />

                            <Text style={styles.modalCardTitle}>Description</Text>
                            <TextInput
                                style={[
                                    styles.addCardInput,
                                    {height: 100}
                                ]}
                                placeholderTextColor={'black'}
                                onChangeText={setDescription}
                                value={description}
                                placeholder='Enter...'
                            />
                            
                            <Text style={styles.modalCardTitle}>Details</Text>
                            <TextInput
                                style={[
                                    styles.addCardInput,
                                    {height: 100}
                                ]}
                                placeholderTextColor={'black'}
                                onChangeText={setDetails}
                                value={details}
                                placeholder='Enter...'
                            />
                        </ScrollView>
                    </View>

                    <Pressable 
                        style={[
                            styles.addCardModalButton,
                            {paddingHorizontal: 15}
                        ]}
                        onPress={() => addNewCard()}>
                        <Text style={styles.addCardText}>+ Add Card</Text>
                    </Pressable>
                    
                </View>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <AddCardModal/>
            { results.length == 0 
                ?   <Text style={{
                        fontSize: 30,
                        fontWeight: '500',
                        color: 'gray',
                        textAlign: 'center',
                    }}>
                        No Results Found
                    </Text>
                :   <View style={styles.container}>
                        <CardInfoModal/>
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
                                    data={results}
                                    renderItem={({ item }) => 
                                        <ResultRow card={item}/>
                                    }
                                />
                                : <FlatList
                                    key={'gridList'}
                                    data = {results}
                                    numColumns={2}
                                    renderItem={({ item }) => 
                                        <View style={styles.resultGrid}>
                                            <ResultGrid card={item}/>
                                        </View>
                                    }
                                />
                            }
                        </View>
                    </View>
            }
            <View style={{
                width: '100%',
                paddingVertical: 10,
                alignItems: 'center',
            }}>
                <View style={styles.inputBoxContainer}>
                    <TextInput
                        style={styles.inputBox}
                        onChangeText={onChangeSearchQuery}
                        onSubmitEditing={onSubmitSearch}
                        value={searchQuery}
                        placeholder="Search"
                    />
                </View>
                <Pressable
                    onPress={popupAddCardModal}
                    style={styles.addCardButton}
                >
                    <Text style={styles.addCardText}>+ Add Card</Text>
                </Pressable>
            </View>
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
        height: '10%',
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
    addCardButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#350023',
        marginHorizontal: 5,
    },
    addCardModalButton: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#350023',
        marginHorizontal: 5,
    },
    addCardText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addCardInput: {
        width: '100%',
        backgroundColor: 'white',
        borderColor: '#350023',
        color: 'black',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    }
});