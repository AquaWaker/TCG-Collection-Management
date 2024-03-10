import React, {useState} from 'react';
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, FlatList, ImageBackground, Pressable, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export const Decks = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const dummyData = require('./dummyData.json');

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
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Finish</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={styles.deckGrid}>
                <FlatList
                    data = {dummyData.Decks}
                    renderItem={({ item }) =>
                    <View style={styles.deckBox}>
                        <Text style={styles.logoText}>LOGO</Text>
                        <View>
                            <Text>{item.name}</Text>
                            <Text>{item.game}</Text>
                        </View>
                    </View>
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
        color: 'white',
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
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    deckBox: {
        borderWidth: 5,
        flexDirection: 'row', 
        padding: 50,
        marginVertical: 8,
        marginHorizontal: 16,
    }
});