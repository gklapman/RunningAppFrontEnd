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
import MapView from 'react-native-maps';


export class OurMap extends Component {
  render() {
    return (
      <View style={styles.mapcontainer}>
        <MapView style={styles.map}/>
      </View>
    );
  }
}

export default OurMap