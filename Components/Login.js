// import axios from 'axios';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image, 
  Button,
} from 'react-native';
import styles from '../Styles'
import {StackNavigator} from 'react-navigation';

export default class Login extends Component {
  render(){
    const { navigate } = this.props.navigation;
    console.log('styles', styles)
    // const gotoStats = () => {
    //   axios.get('http://localhost:3000/api/users/')
    //    .then(res => {
    //      console.log(res);
    //     //  dispatch(setUser(res.data));
    //    })
    //   return Actions.statsPage({logininfo: 'blah blah login info'});
    // }
    const goToStats = () => {
      navigate('OurApp')
    }

    return (
      <View style={styles.container}>
        <Text>Email:</Text>
        <TextInput style={styles.input} />
        <Text>Password:</Text>
        <TextInput style={styles.input} />
        <TouchableOpacity>
          <Button
          onPress={goToStats}
          title="Login"
        />
        </TouchableOpacity>
      </View>
    )
  }
}