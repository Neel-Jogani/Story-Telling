import * as React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer'
import StackNavigator from './StackNavigator'
import ProfilePic from '../screens/ProfilePicture'
import LogOut from '../screens/LogOut'

const Drawer = createDrawerNavigator()

export default function DrawerNavigator(){
    return(
        <Drawer.Navigator>
            <Drawer.Screen name='Home' component={StackNavigator}/>
            <Drawer.Screen name='Profile' component={ProfilePic}/>
            <Drawer.Screen name='LogOut' component={LogOut}/>
        </Drawer.Navigator>
    )
}