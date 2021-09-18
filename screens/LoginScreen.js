import * as React from 'react'
import { View, Text, TouchableOpacity,StyleSheet,SafeAreaView,Platform,StatusBar,Image } from 'react-native'   
import * as Google from 'expo-google-app-auth'
import firebase from 'firebase'
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import {RFValue} from 'react-native-responsive-fontsize'
import { color } from 'react-native-reanimated'
let customFonts= {BubblegumSans: require('../assets/fonts/BubblegumSans-Regular.ttf')}

export default class LoginScreen extends React.Component{
    constructor(props){
       super(props)
       this.state={
        fontsLoaded: false
       }
    }

    async _loadFontsAsync(){
      await Font.loadAsync(customFonts)
      this.setState({
        fontsLoaded: true
      })
    }
    componentDidMount(){
      this._loadFontsAsync()
    }

    signInWithGoogleAsync=async()=> {
        try {
          const result = await Google.logInAsync({
            behaviour: 'web',
            androidClientId: '1045961418091-1s3jk2q4akvet0jehtmrplrtoi6a83at.apps.googleusercontent.com',
            iosClientId: '1045961418091-hv3ecfs63f7k77ifcu257mj7o08v4vm2.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            this.onSignIn(result)
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          console.log(e.message)
          return { error: true };
        }
      }
      onSignIn=(googleUser)=>{
        var unsubscribe= firebase.auth().onAuthStateChanged((firebaseUser)=>{
          unsubscribe()
          if(!this.isUserEqual(googleUser,firebaseUser)){
            var credantials= firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
            )
          firebase
          .auth()
          .signInWithCredential(credantials)
          .then(function(result){
              if(result.additionalUserInfo.isNewUser){
                  firebase
                  .database()
                  .ref('/users/'+ result.user.uid)
                  .set({
                      gmail: result.user.email,
                      profile_picture: result.additionalUserInfo.profile.picture,
                      locale: result.additionalUserInfo.profile.locale,
                      first_name: result.additionalUserInfo.profile.given_name,
                      last_name: result.additionalUserInfo.profile.family_name,
                      current_theme: 'dark'
                  })
                  .then(function(snapshot){})
              }
          })
            .catch((error)=>{})
        }
                else{
                    console.log('the user has already signed into firebase')
                }
        })

      }
      isUserEqual=(googleUser,firebaseUser)=>{
            if(firebaseUser){
                var providerData= firebase.providerData
                for(var i=0; i<providerData.length;i++){
                    if(providerData[i].providerId===firebase.auth.GoogleAuthProvider.PROVIDER_ID && providerData[i].uid===googleUser.getBasicProfile().getId()){
                        return true
                    }
                }
            }
            return false
      }
    render(){
      if(!this.state.fontsLoaded){
        return <AppLoading/>
      }
      else{
        return(
          <View style={styles.container}>
            <SafeAreaView style={styles.droidSafeArea}/>
              <View style={styles.titleContainer}>
                <Image source={require('../assets/logo.png')} style={styles.appIcon}/>
                <Text style={styles.titleText}>Story Telling</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={()=>{this.signInWithGoogleAsync()}}>

                  <Image source={require('../assets/google_icon.png')} style={styles.googleIcon}/>
                  <Text style={styles.googleText}>Sign-In with Google</Text>

                </TouchableOpacity>
              </View>
              <View style={styles.cloudContainer}>
                <Image source={require('../assets/cloud.png')} style={styles.cloudImg}/>
              </View>
          </View>
      )
      }
      
    }
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  titleContainer:{
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  appIcon:{
    width: RFValue(120),
    height: RFValue(120),
    resizeMode: 'contain'
  },
  titleText:{
    fontFamily: 'BubblegumSans',
    fontSize: RFValue(40),
    textAlign: 'center',
    color: 'white'
  },
  buttonContainer:{
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button:{
    width:RFValue(250),
    height:RFValue(40),
    flexDirection: "row",
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'lightyellow',
    borderRadius: RFValue(25)
  },
  googleIcon:{
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: 'contain'
  },
  googleText:{
    fontFamily: 'BubblegumSans',
    fontSize: RFValue(20),
    color:'#15193c'
  },
  cloudContainer:{
    flex: 0.3,
  },
  cloudImg:{
    position: 'absolute',
    width: '100%',
    resizeMode: 'contain',
    bottom: RFValue(-7)
  },

})