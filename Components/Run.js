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
import OurMap from './OurMap'
import MapView from 'react-native-maps';



class Run extends Component {
  render() {

    const gotoRouteSelect = () => Actions.routeSelectPage({text: 'this goes to route select page!'});
    const marker = {
    	latlng: {latitude: 37, longitude: -122},
    	title: 'test',
    	description: 'this is a test'
    }


    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        console.log('this is the initial', initialPosition)
      }
      )

    return (
      <View>

        <View style={styles.mapcontainer}>
       	 	<MapView style={styles.map}>
       	 	 <MapView.Marker
      			coordinate={marker.latlng}
      			title={marker.title}
      			description={marker.description}
    		/>
       	 	</MapView>
      	</View>

      </View>
    )
  }
}

export default Run

//         <View>
//           <Text onPress={gotoRouteSelect} style={styles.button}>Create a route</Text>
//         </View>

      // <View>
      //  		<Text onPress={gotoRouteSelect} style={styles.button}>Select a route</Text>
      //  </View>

      //  <Text>CAN YOU SEE THIS </Text>