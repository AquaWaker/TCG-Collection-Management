import React, {useState} from 'react';
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, FlatList, ImageBackground, Pressable, Image, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Entypo, Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler';

export const SearchResultsPage = () => {

    const [searchQuery, onChangeSearchQuery] = React.useState('Search');
    const [viewLayout, setViewLayout] = React.useState('grid');
    
    const dummyData = require('./dummyData.json');

    const placeholderImage = require('./assets/wireframe.png');

    const ResultRow = ({name, setid, id, image}) => {
        return (
            <View style={styles.resultRow}>
                <View style={styles.resultRowThumbnail}>
                    <ImageBackground
                        style={styles.cardImage}
                        source={image != 'none' ? {uri: image} : placeholderImage}
                        resizeMode='cover'
                    />
                </View>
                <View style={styles.resultRowCardInfo}>
                    <Text style={styles.cardTitle}>{name}</Text>
                    <Text style={styles.cardSubtitle}>({setid}) {id}</Text>
                </View>
            </View>
        );
    };

    const ResultGrid = ({image}) => {
        return (
            <View style={styles.resultGridThumbnail}>
                <ImageBackground
                    style={styles.cardImage}
                    source={image != 'none' ? {uri: image} : placeholderImage}
                    resizeMode='cover'
                />
            </View>
        )
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.layoutOptions}>
                <TouchableOpacity onPress={() => setViewLayout('grid')}>
                    <Entypo name="grid" size={24} color={viewLayout=='grid' ? '#247BA0' : "black"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setViewLayout('row')}>
                    <Ionicons name="reorder-three" size={24} color={viewLayout=='row' ? '#247BA0' : "black"} />
                </TouchableOpacity>
            </View>
            <View style={{
                flex: 1,
                width: '100%',
                alignContent: 'center',
                justifyContent: 'center',
                paddingHorizontal: viewLayout == 'row' ? 0 : 0,
            }}>
                { viewLayout == 'row'
                    ? <FlatList
                        key={'rowList'}
                        data={dummyData.Cards}
                        renderItem={({ item }) => 
                            <ResultRow
                                name={item.name}
                                setid={item.setid}
                                id={item.id}
                                image={item.image}
                            />
                        }
                    />
                    : <FlatList
                        key={'gridList'}
                        data = {dummyData.Cards}
                        numColumns={2}
                        renderItem={({ item }) => 
                            <View style={styles.resultGrid}>
                                <ResultGrid image={item.image}/>
                            </View>
                        }
                    />
                }
            </View>

            <View style={styles.inputBoxContainer}>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={onChangeSearchQuery}
                    value={searchQuery}
                    placeholder="Search"
                />
                <View>
                {/* Insert search filters here */}
                </View>
            </View>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
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
    resultRowThumbnail: {
        width: '25%',
        height: '100%',
        marginRight: 20,
        borderRadius: 5,
        overflow: 'hidden',
    },
    resultGridThumbnail: {
        width: 135,
        height: 180,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 20,
        overflow: 'hidden',
    },
    cardImage: {
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
    },
});