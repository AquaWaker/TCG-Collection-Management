import 'react-native-gesture-handler';
import { StyleSheet, Text, View, SafeAreaView, FlatList, ImageBackground, Pressable, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>HomeScreen</Text>
      </View>
    </SafeAreaView>
  )  
}

function SearchResults() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>SearchResults</Text>
      </View>
    </SafeAreaView>
  )  
}

function Decks() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Decks</Text>
      </View>
    </SafeAreaView>
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
          component={Decks}
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
});
