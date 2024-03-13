import "react-native-gesture-handler";
import { Alert, Modal, StyleSheet, Text, View, SafeAreaView, FlatList, ImageBackground, Pressable, Image, TextInput } from "react-native";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Decks } from "./Decks";
import { SearchResultsPage } from "./SearchResultsPage";
import { useState } from "react";
import { Checkbox } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import shuffleIcon from "./assets/logo.png";

const dummyData = require("./dummyData.json");

function CustomTitle() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* <Image source={shuffleIcon} style={{ width: 50, height: 50, marginLeft: 5 }} /> */}
      <Text style={{ fontWeight: "bold", fontSize: 28, color:"white", marginRight: 50 }}>SHUFFLED</Text>
    </View>
  );
}
function SearchTitle() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* <Image source={shuffleIcon} style={{ width: 50, height: 50, marginLeft: 5 }} /> */}
      <Text style={{ fontWeight: "bold", fontSize: 28, color:"white", marginRight: 50 }}>SEARCH RESULTS</Text>
    </View>
  );
}
function DeckTitle() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* <Image source={shuffleIcon} style={{ width: 50, height: 50, marginLeft: 5 }} /> */}
      <Text style={{ fontWeight: "bold", fontSize: 28, color:"white", marginRight: 50}}>YOUR DECKS</Text>
    </View>
  );
}

function HomeScreen() {
  const [searchQuery, onChangeSearchQuery] = React.useState("Search");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();

  const onSubmitSearch = () => {
    navigation.navigate("SEARCH RESULTS");
  };

  const onFilterPress = () => {
    setFilterModalVisible(true);
    console.log("Filter button pressed");
  };

  const onCloseModal = () => {
    setFilterModalVisible(false);
  };

  const onAdvancedPress = () => {
    Alert.alert("Advanced Filters", "This is where advanced filter options can be configured", [{ text: "OK", onPress: () => console.log("OK Pressed") }], { cancelable: true });
  };

  const filters = ["Liked ", "Game ", "In Deck ", "Not in Deck ", "Recents ", "New Arrivals ", "Promo "];

  const [selectedFilters, setSelectedFilters] = useState(new Array(filters.length).fill(false));

  const [isSelected, setSelection] = useState([false, false, false]);

  const toggleCheckbox = (index) => {
    setSelection((currentSelection) => currentSelection.map((item, i) => (i === index ? !item : item)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "90%" }}>
      <View style={styles.opaqueBox}>
        <Text style={styles.loremText}>Search Your Collection</Text>
        <TextInput style={styles.inputBox} onChangeText={onChangeSearchQuery} onSubmitEditing={onSubmitSearch} value={searchQuery} placeholder="Search" />
        <View style={styles.filterButtonOuterContainer}>
          <View style={styles.filterButtonContainer}>
            <Pressable style={styles.filterButton} onPress={onFilterPress}>
              <Text style={styles.filterButtonText}>Filters</Text>
            </Pressable>
          </View>
        </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isFilterModalVisible}
          onRequestClose={() => {
            setFilterModalVisible(!isFilterModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable onPress={onCloseModal} style={styles.closeFilter}>
                <MaterialCommunityIcons name="close" size={30} color="black" />
              </Pressable>
              <Text style={styles.modalText}>FILTERS</Text>
              <FlatList
                data={filters}
                renderItem={({ item, index }) => (
                  <View style={styles.filterItem}>
                    <Text style={styles.filterText}>{item}</Text>
                    <View style={[styles.checkboxContainer, { backgroundColor: selectedFilters[index] ? "transparent" : "white" }]}>
                      <Checkbox
                        status={selectedFilters[index] ? "checked" : "unchecked"}
                        onPress={() => {
                          const updatedFilters = selectedFilters.map((selected, idx) => (index === idx ? !selected : selected));
                          setSelectedFilters(updatedFilters);
                        }}
                        color="white"
                      />
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
              />
              <Pressable style={styles.advancedButton} onPress={onAdvancedPress}>
                <Text style={styles.filterButtonText}>Advanced</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function SearchResults() {
  return <SearchResultsPage></SearchResultsPage>;
}

function DecksPage() {
  return <Decks></Decks>;
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" screenOptions={{
    drawerStyle: {
      backgroundColor: "rgba(53, 0, 35, 0.9)", 
    },
    drawerActiveTintColor: "white",
    drawerInactiveTintColor: "#999", 
  }}>
        <Drawer.Screen
          name="HOME"
          component={HomeScreen}
          options={{
            headerTitle: (props) => <CustomTitle {...props} />,
            headerStyle: {
              backgroundColor: "#45062E",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 28,
            },
          }}
        />
        <Drawer.Screen
          name="SEARCH RESULTS"
          component={SearchResults}
          options={{
            headerTitle: (props) => <SearchTitle {...props} />,
            headerStyle: {
              backgroundColor: "#45062E",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
              textAlign: "center",
            },
          }}
        />
        <Drawer.Screen
          name="DECKS"
          component={DecksPage}
          options={{
            headerTitle: (props) => <DeckTitle {...props} />,
            headerStyle: {
              backgroundColor: "#45062E",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
              textAlign: "center",
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
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  deckGrid: {
    flex: 5,
  },
  inputBox: {
    borderWidth: 2,
    width: "100%",
    height: 50,
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 10,
    borderColor: "black",
    borderRadius: 10,
  },
  loremText: {
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  filterButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  filterButton: {
    backgroundColor: "#350023",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: "50%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    justifyContent: "center",
  },
  filterButtonText: {
    alignItems: "center",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 450,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "80%",
    maxHeight: "80%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#350023",
    paddingVertical: 8,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 5,
    width: "45%",
    height: 60,
  },
  filterText: {
    marginLeft: 10,
    padding: 5,
    fontSize: 14,
    color: "white",
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  buttonContainer: {
    backgroundColor: "#D3D3D3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  advancedButton: {
    backgroundColor: "#350023",
    padding: 10,
    borderRadius: 5,
    width: "50%",
  },
  closeButton: {
    backgroundColor: "#350023",
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  iconUnderCheckbox: {
    position: "absolute",
    top: 4,
    left: 4,
    zIndex: -1,
  },
  closeFilter: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
  },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    opaqueBox: {
      padding: 10,
      borderRadius: 10,
    },
});
