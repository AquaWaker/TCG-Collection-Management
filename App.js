import 'react-native-gesture-handler';
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, FlatList, ImageBackground, Pressable, Image, TextInput} from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Decks } from './Decks';
import { SearchResultsPage } from './SearchResultsPage';

const dummyData = require('./dummyData.json');


function HomeScreen() {

  const [searchQuery, onChangeSearchQuery] = React.useState('Search');
  const navigation = useNavigation();

  const onSubmitSearch = () => {
    navigation.navigate('SearchResults');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{width: '90%'}}>
        <TextInput
            style={styles.inputBox}
            onChangeText={onChangeSearchQuery}
            onSubmitEditing={onSubmitSearch}
            value={searchQuery}
            placeholder="Search"
        />
        <View>
          {/* Make some filters appear here */}
        </View>
      </View>
    </SafeAreaView>
  )  
}

function SearchResults() {
  return (
    <SearchResultsPage></SearchResultsPage>
  )  
}

function DecksPage() {
  return (
    <Decks></Decks>
  )  
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen 
          name="Home" 
          component={HomeScreen}
          options= {{
            title: 'Search Your Collection',
            headerStyle: {
              backgroundColor: '#45062E',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              textAlign: 'center',
            },
          }}
        />
        <Drawer.Screen 
          name="SearchResults" 
          component={SearchResults}
          options= {{
            title: 'Search Results',
            headerStyle: {
              backgroundColor: '#45062E',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              textAlign: 'center',
            },
          }}
        />
        <Drawer.Screen 
          name="Decks" 
          component={DecksPage}
          options= {{
            title: 'Decks',
            headerStyle: {
              backgroundColor: '#45062E',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              textAlign: 'center',
            },
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckGrid: {
    flex: 5,
  },
  inputBox: {
    borderWidth: 2,
    width: '100%',
    height: 50,
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 10,
    borderColor: 'black',
    borderRadius: 10,
  },
});
