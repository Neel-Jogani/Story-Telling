import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from 'firebase'

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: "image_1",
      dropdownHeight: 40,
      title: '',
      description: '',
      story: '',
      moral:'',
      lightTheme: true
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser()
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
  async addStory(){
    if(this.state.title && this.state.description && this.state.story && this.state.moral){
      let storyData= {
        previewImage: this.state.previewImage,
        title: this.state.title,
        story:this.state.story,
        moral: this.state.moral,
        description: this.state.description,
        author: firebase.auth().currentUser.displayName,
        createdOn: new Date(),
        authorUid: firebase.auth().currentUser.uid,
        likes: 0
      }

      await firebase.database().ref('/posts/'+(Math.random().toString(36).slice(2)))
            .set(storyData)
            .then(function(item){})
            this.props.setUpdateToTrue()
            this.props.navigation.navigate('Feed')
    }

    else{
        ToastAndroid.show('All fields are require', ToastAndroid.SHORT)
    }
  }


  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let preview_images = {
        image_1: require("../assets/story_image_1.png"),
        image_2: require("../assets/story_image_2.png"),
        image_3: require("../assets/story_image_3.png"),
        image_4: require("../assets/story_image_4.png"),
        image_5: require("../assets/story_image_5.png")
      };
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
              <Text style={this.state.lightTheme?styles.appTitleTextLight:styles.appTitleText}>New Story</Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={preview_images[this.state.previewImage]}
                style={styles.previewImage}
              ></Image>
              <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: "Image 1", value: "image_1" },
                    { label: "Image 2", value: "image_2" },
                    { label: "Image 3", value: "image_3" },
                    { label: "Image 4", value: "image_4" },
                    { label: "Image 5", value: "image_5" }
                  ]}
                  defaultValue={this.state.previewImage}
                  containerStyle={{
                    height: 40,
                    borderRadius: 20,
                    marginBottom: 10
                  }}
                  onOpen={() => {
                    this.setState({ dropdownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropdownHeight: 40 });
                  }}
                  style={{ backgroundColor: "transparent" }}
                  itemStyle={{
                    justifyContent: "flex-start"
                  }}
                  dropDownStyle={this.state.lightTheme? {backgroundColor: "white"}:{backgroundColor: "#2f345d" }}
                  labelStyle={
                    this.state.lightTheme?{
                      color: "black",
                      fontFamily: "Bubblegum-Sans"
                    }:{
                    color: "white",
                    fontFamily: "Bubblegum-Sans"
                    }
                  }
                  arrowStyle={
                    this.state.lightTheme?{
                      color: "black",
                      fontFamily: "Bubblegum-Sans"
                    }:{
                    color: "white",
                    fontFamily: "Bubblegum-Sans"
                    }
                  }
                  onChangeItem={item =>
                    this.setState({
                      previewImage: item.value
                    })
                  }
                />
              </View>
              <TextInput placeholder={'Title'}
                         style={this.state.lightTheme?styles.inputBoxLight:styles.inputBox}
                         placeholderTextColor={this.state.lightTheme?'black':'white'}
                         onChangeText={(title)=>{
                            this.setState({
                                title:title
                            })
                         }}/>
              <TextInput placeholder={'Description'}
                         style={this.state.lightTheme?[styles.inputBoxLight, {marginTop:RFValue(15)}]:[styles.inputBox, {marginTop:RFValue(15)}]}
                         placeholderTextColor={this.state.lightTheme?'black':'white'}
                         onChangeText={(description)=>{
                            this.setState({
                                description:description
                            })
                         }}
                         multiline={true}
                         numberOfLines={7}/>
               <TextInput placeholder={'Story'}
                          style={this.state.lightTheme?[styles.inputBoxLight, {marginTop:RFValue(15)}]:[styles.inputBox, {marginTop:RFValue(15)}]}
                         placeholderTextColor={this.state.lightTheme?'black':'white'}
                         onChangeText={(story)=>{
                            this.setState({
                                story:story
                            })
                         }}
                         multiline={true}
                         numberOfLines={20}/>
              <TextInput placeholder={'Moral'}
                         style={this.state.lightTheme?[styles.inputBoxLight, {marginTop:RFValue(15)}]:[styles.inputBox, {marginTop:RFValue(15)}]}
                         placeholderTextColor={this.state.lightTheme?'black':'white'}
                         onChangeText={(moral)=>{
                            this.setState({
                                moral:moral
                            })
                         }}
                         multiline={true}
                         numberOfLines={3}/>
                      
              <View style={styles.submitContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={()=>this.addStory()}>
                         <Text style={styles.submitText}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
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
  fieldsContainer: {
    flex: 0.85
  },
  previewImage: {
    width: "93%",
    height: RFValue(250),
    alignSelf: "center",
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: "contain"
  },
  inputBoxLight:{
    height: RFValue(40),
    borderColor: 'black',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    fontFamily:"Bubblegum-Sans"
},
  inputBox:{
      height: RFValue(40),
      borderColor: 'white',
      borderWidth: RFValue(1),
      borderRadius: RFValue(10),
      paddingLeft: RFValue(10),
      fontFamily:"Bubblegum-Sans"
  },
  submitContainer:{
    marginTop: RFValue(25),
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButton:{
    width: RFValue(100),
    height: RFValue(40),
    backgroundColor: 'lightyellow',
    borderRadius: RFValue(20),
    borderWidth: RFValue(1),
    justifyContent: 'center'
  },
  submitText:{
    fontSize: RFValue(17),
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Bubblegum-Sans'
  },
});
