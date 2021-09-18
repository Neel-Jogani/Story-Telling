import * as React from 'react'
import { View, Text, TouchableOpacity,StyleSheet,StatusBar,Platform,SafeAreaView,Image,Switch} from 'react-native'
import * as Font from 'expo-font'
import AppLoading from 'expo-app-loading'
import firebase from 'firebase'
import {RFValue} from 'react-native-responsive-fontsize'

let custom_font={BubblegumSans: require('../assets/fonts/BubblegumSans-Regular.ttf')}

export default class ProfilePic extends React.Component{
    constructor(props){
        super(props)
        this.state={
            fontsLoaded: false,
            isEnabled:false,
            lightTheme: true,
            profileImg: '',
            name: '',
        }
    }
    async _loadFontsAsync(){
        await Font.loadAsync(custom_font)
        this.setState({
            fontsLoaded: true
        })
    }
    componentDidMount(){
        this._loadFontsAsync()
        this.fetchUser()
    }

    fetchUser=async()=>{
        let theme,name,img
        await firebase
        .database()
        .ref('/users/'+firebase.auth().currentUser.uid)
        .on('value', function(item){
            theme= item.val().current_theme
            name= `${item.val().first_name}  ${item.val().last_name}`
            img= item.val().profile_picture
        })
        this.setState({
            name: name,
            profileImg: img,
            lightTheme: theme=== 'light'?true:false,
            isEnabled: theme==='light'?false:true
        })
    }

    toggleSwitch(){
        const previous_state= this.state.isEnabled
        const theme= !this.state.isEnabled?'dark':'light'
        var updates= {}
        updates['/users/'+firebase.auth().currentUser.uid+'/current_theme']= theme
        firebase.database().ref().update(updates)
        this.setState({
            isEnabled: !previous_state,
            lightTheme: previous_state
        })
    }
    render(){
        if(!this.state.fontsLoaded){
            return <AppLoading/>
        }
        else{
            return(
                <View style={ this.state.lightTheme?styles.containerLight:styles.container}>
                    <SafeAreaView style={styles.droidSafeArea} />
                    <View style={styles.appTitle}>
                    <View style={styles.appIcon}>
                        <Image
                        source={require("../assets/logo.png")}
                        style={styles.iconImage}/>
                        
                    </View>
                    <View style={styles.appTitleTextContainer}>
                        <Text style={this.state.lightTheme?styles.appTitleTextLight:styles.appTitleText}>Storytelling App</Text>
                    </View>
                    </View>
                    <View style={styles.screenContainer}>
                        <View style={styles.profileImgContainer}>
                            <Image source={{uri: this.state.profileImg}} style={styles.profileImg}/>
                            <Text style={this.state.lightTheme?styles.nameTextLight:styles.nameText}>{this.state.name}</Text>
                        </View>
                        <View style={styles.themeContainer}>
                            <Text style={this.state.lightTheme?styles.themeTextLight:styles.themeText}>Dark Theme</Text>
                            <Switch style={{transform:[{scaleX:1.3}, {scaleY:1.3}]}} 
                                    trackColor={{false:'grey',true:'white'}}
                                    thumbColor={this.state.isEnabled?'lightyellow':'orange'}
                                    ios_backgroundColor={'grey'}
                                    onValueChange={()=>{this.toggleSwitch()}}
                                    value={this.state.isEnabled}/>
                        </View>
                    </View> 
                </View>
            )
        }
       
    }
}

const styles=StyleSheet.create({
    containerLight:{
      flex: 1,
      backgroundColor: '#cfe8e5'
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
        color:'black',
        fontSize: RFValue(28),
        fontFamily: "Bubblegum-Sans"
      },
      appTitleText: {
        color: 'white',
        fontSize: RFValue(28),
        fontFamily: "Bubblegum-Sans"
      },
      screenContainer:{
          flex:0.85,
      },
      profileImgContainer:{
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center"
      },
      profileImg:{
        width: RFValue(140),
        height: RFValue(140),
        resizeMode: "contain",
        borderRadius: RFValue(70)
      },
      nameTextLight:{
        color: 'black',
        fontSize: RFValue(40),
        fontFamily: "Bubblegum-Sans",
        marginTop: RFValue(15)
      },
      nameText:{
        color: 'white',
        fontSize: RFValue(40),
        fontFamily: "Bubblegum-Sans",
        marginTop: RFValue(15)
      },
      themeContainer:{
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        marginTop: RFValue(40)
      },
      themeTextLight:{
        color: 'black',
        fontSize: RFValue(15),
        fontFamily: "Bubblegum-Sans",
        marginRight: RFValue(15)
      },
      themeText:{
        color: "white",
        fontSize: RFValue(15),
        fontFamily: "Bubblegum-Sans",
        marginRight: RFValue(15)
      },
})