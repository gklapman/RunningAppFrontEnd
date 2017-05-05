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
import TimeFormatter from 'minutes-seconds-milliseconds'


class MakeRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPosition: {coords: { latitude: 41.878, longitude: -87.63 } }, //THIS WILL BE TAKEN FROM THE STORE TO RENDER INITIAL RUNNER STATE
			isRunning: false,
			timer: '00.00.00',
			timerStart: '00.00.00',
		}
		this.startStopButton = this.startStopButton.bind(this)
	}



  startStopButton() {

    	if(this.state.isRunning){
    		clearInterval(this.interval)
    		this.setState({
    			isRunning: false,
    		})
    		return; 
    	} else {
    		console.log('this should run after false ', this.state.isRunning)
	    		this.setState({
	    		isRunning: true,
	    		timerStart: Date.now()
    		})
	    		this.interval = setInterval(() => {
		    	this.setState({
		    		timer: Date.now() - this.state.timerStart
		    	})
		    	navigator.geolocation.getCurrentPosition(
		    		(position) => {
		    			console.log('position', position)
		    			this.setState({
		    				currentPosition: position
		    			})
		    		})
	   		 }, 500);
    	}

    	
  
    	}

    	
    	
  render() {


    const position = this.state.currentPosition;
    console.log(position)

    return (
      <View>
      	<View style={styles.mapcontainer}>
      		<View style={styles.startStop}>
      		<TouchableOpacity onPress={this.startStopButton.bind(this)}>
      			<Text>{this.state.isRunning ? 'Stop' : 'Start'}</Text>
      		</TouchableOpacity>
      		</View>
      		<View style={styles.timer}>
      			<Text>{TimeFormatter(this.state.timer)}</Text>
      			<Text>{this.state.currentPosition.coords.latitude}</Text>
      			<Text>{this.state.currentPosition.coords.longitude}</Text>
      			
      		</View>
        
       	 	<MapView 
       	 		region={{latitude: position.coords.latitude, longitude: position.coords.longitude, latitudeDelta: 1, longitudeDelta: 1}}
			    style={styles.map}/>
      	</View>

      </View>
    )
  }
}

export default MakeRoute



