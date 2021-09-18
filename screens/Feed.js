import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import StoryCard from "./StoryCard";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";
import firebase from 'firebase'

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

let stories = require("./TempStories.json");

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      lightTheme:true,
      stories: []
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchStories();
  }

  
  fetchUser(){
    let theme
    firebase.database()
    .ref('/users/'+firebase.auth().currentUser.uid)
    .on('value', function(item){
      theme= item.val().current_theme
    })

    this.setState({
      lightTheme: theme === "light" ?true:false
    })
  }

  fetchStories=()=>{
    firebase.database().ref('/posts/').on('value', (data)=>{
      let stories= []
      if(data.val()){
        Object.keys(data.val()).forEach(function(keys){
          stories.push({
            key:keys,
            value: data.val()[keys]
          })
        })
      }
      this.setState({
        stories:stories
      })
      this.props.setUpdateToFalse()
    },function(error){
      console.log('Stories failed to be fetched'+ error.code)
    })
  }


  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={this.state.lightTheme?styles.containerLight:styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={this.state.lightTheme?styles.appTitleTextLight:styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>
         {
           !this.state.stories[0]?
           <View style={styles.noStoryContainer}>
             <Text style={this.state.lightTheme?styles.noStoryTextLight:styles.noStoryText}>No story Available</Text>
           </View>
           :
           <View style={styles.cardContainer}>
           <FlatList
             keyExtractor={this.keyExtractor}
             data={stories}
             renderItem={this.renderItem}
           />
         </View>
         }

          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  containerLight: {
    flex: 1,
    backgroundColor: "#cfe8e5"
  },
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  cardContainer: {
    flex: 0.85
  },
  noStoryContainer:{
    flex: 0.85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noStoryText:{
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
    color: 'white'
  },
  noStoryText:{
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
    color: 'black'
  },
});
