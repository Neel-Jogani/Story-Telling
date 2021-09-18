import React from 'react';
import { StyleSheet } from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import{RFValue} from 'react-native-responsive-fontsize'
import CreateStory from '../screens/CreateStory';
import Feed from '../screens/Feed';
import Ionicons from 'react-native-vector-icons/Ionicons'
import firebase from 'firebase'

const Tab= createMaterialBottomTabNavigator()

export default class TabNavigator extends React.Component {
  constructor(props){
    super(props);
    this.state={
      lightTheme: true,
      isUpdated: false
    }
  }
  componentDidMount(){
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
  changeUpdated=()=>{
    this.setState({
      isUpdated: true
    })
  }
  removeUpdated=()=>{
    this.setState({
      isUpdated: false
    })
  }

  renderFeed=(props)=>{
      return <Feed setUpdateToFalse= {this.removeUpdated}{...props}/>
  }

  renderStory=(props)=>{
    return <CreateStory setUpdateToTrue={this.changeUpdated}{...props}/>
  }
  
  render(){
  return (
     <Tab.Navigator 
     labeled= {false}
     barStyle= {this.state.lightTheme?styles.bottomTabLight:styles.bottomTab}
     screenOptions={({route})=>({
       tabBarIcon:({focused,color,size})=>{
         let iconName
         if(route.name==='Feed'){
           iconName= focused?'book':'book-outline'
         }
         else if(route.name==='CreateStory'){
          iconName= focused?'create':'create-outline'
         }
         return <Ionicons name={iconName} size={RFValue(25)} style={styles.icon} color={color}/>
       }
     })}
     tabBarOptions={{
       activeTintColor: 'black',
       inactiveTintColor: 'grey'
     }}>
       <Tab.Screen name='Feed' component= {this.renderFeed}/>
       <Tab.Screen name='CreateStory' component= {this.renderStory}/>
     </Tab.Navigator>
  )
  }
}


const styles= StyleSheet.create({
  bottomTabLight:{
    backgroundColor: '#cfd7e8',
    height: '8%',
    position: 'absolute',
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  bottomTab:{
    backgroundColor: '#03002E',
    height: '8%',
    position: 'absolute',
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  icon:{
    width: RFValue(30),
    height: RFValue(30)
  },
})

