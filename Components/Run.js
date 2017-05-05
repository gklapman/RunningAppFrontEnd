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



class Run extends Component {
  render() {

  	const { navigate } = this.props.navigation;
    //const gotoRouteSelect = () => Actions.routeSelectPage({text: 'this goes to route select page!'});
    const marker = {
    	latlng: {latitude: 37, longitude: -122},
    	title: 'test',
    	description: 'this is a test'
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
      })

    const goToRouteMaker = () => {
    	navigate('MakeRoute')
   	}

    const filter = () => {
    	console.log('this will be for filters')
    }

    return (
      <View>

        <View style={styles.mapcontainer}>
        	<View style={styles.createRoute}>
       	 		<Button onPress={goToRouteMaker} title="Create a Route"></Button>
       	 		</View>
       	 		<View style={styles.filter}>
       	 		<Button onPress={filter} title="Filter Your Routes"></Button>
       	 		</View>
       	 	<MapView style={styles.map}/>
      	</View>

      </View>
    )
  }
}

export default Run






	    		/*<MapView.Marker
      			coordinate={marker.latlng}
      			title={marker.title}
      			description={marker.description}
    			/>*/

//         <View>
//           <Text onPress={gotoRouteSelect} style={styles.button}>Create a route</Text>
//         </View>

      // <View>
      //  		<Text onPress={gotoRouteSelect} style={styles.button}>Select a route</Text>
      //  </View>

      //  <Text>CAN YOU SEE THIS </Text>