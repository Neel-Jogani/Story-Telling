import * as React from 'react'
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native'
import firebase from 'firebase'
import { RFValue } from 'react-native-responsive-fontsize'

export default class LoadingScreen extends React.Component{
    checkIfLoggedIn=()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                this.props.navigation.navigate('DashboardScreen')
            }
            else{
                this.props.navigation.navigate('LoginScreen')
            }
        })
    }

    componentDidMount(){
        this.checkIfLoggedIn()
    }
    render(){
        return(
            <View style={{flex:1, backgroundColor: 'lightyellow'}}>
                <Text style={{textAlign: 'center', marginTop:RFValue(200), fontSize:RFValue(30), fontWeight:'bold' }}>Loading...</Text>
            </View>
        )
    }
}