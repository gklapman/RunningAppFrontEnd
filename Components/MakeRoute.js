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

			currentPosition: { latitude: 37.33, longitude: -122.0207 } , //THIS WILL BE TAKEN FROM THE STORE TO RENDER INITIAL RUNNER STATE
			isRunning: false,
			timer: '00.00.00',
			timerStart: '00.00.00',
			timerEnd: '00:00:00',
			routeCoords: [],
			timeMarker: []
		}
		this.startStopButton = this.startStopButton.bind(this)
    // this.testButton = this.testButton.bind(this)
	}

  // testButton(){
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       console.log('manually checking position', position)
  //       this.setState({
  //         currentPosition: position
  //       }, ()=>{console.log('setting state (from testButton)',this.state.currentPosition)})
  //     },
  //
  //                 (msg)=>alert('Please enable your GPS position future.'),
  //
  //                 {enableHighAccuracy: true},
  //
  //   )
  // }


  startStopButton() {

  	let intervalIncrease = 0.0005 //THIS IS PURELY FOR TESTING
  	let intervalIncrease2 = 0.0007

    	if(this.state.isRunning){
    		clearInterval(this.interval)
    		clearInterval(this.recordInterval)
    		let finalTime = this.state.timer
    		this.setState({
    			isRunning: false,
    		})
    		return;
    	} else {
    		// const routeCoordsArr = this.state.routeCoords
    		// routeCoordsArr.push(this.state.currentPosition)
	    		this.setState({
	    		isRunning: true,
	    		timerStart: Date.now(),
	    		// routeCoords: routeCoordsArr

    		})
	    		this.interval = setInterval(() => {
		    	this.setState({
		    		timer: Date.now() - this.state.timerStart
		    	})
		    	navigator.geolocation.getCurrentPosition((position) => {
		    			let lng = position.coords.longitude
		    			let lat = position.coords.latitude
              // console.log('this is the latlng', lat, lng)
		    			let newPosition = {latitude: lat, longitude: lng}
              console.log('this is the new', newPosition)
              // let realPosition = Object.assign({}, newPosition)
              // console.log('POSITION ', realPosition)
		    			this.setState({
		    				currentPosition: newPosition
		    			})
		    		},
            (msg)=>alert('Please enable your GPS position future.'),
            {enableHighAccuracy: true},)
            }, 100);

	    		this.recordInterval = setInterval(() => {
            console.log('pushing into routeCoords')
	    			// intervalIncrease += 0.0005
	    			// intervalIncrease2 += 0.0003
            // console.log('CURRENT ROUTECORDS', this.state.routeCoords)
	    			let newrouteCoords = this.state.routeCoords.slice(0)

	    			// let adjustedLat = this.state.currentPosition.latitude + intervalIncrease
	    			// let adjustedLng = this.state.currentPosition.longitude + intervalIncrease2
	    			// let adjustedCoords =  { latitude: adjustedLat, longitude: adjustedLng }
	    			// //ADJUSTED COORDS IS ONLY FOR TESTING!!!!!! IT WILL REALLY PUSH IN CURRENT LOCATION
	    			// newrouteCoords.push(adjustedCoords)

            // let addedPosition = this.state.currentPosition
            // console.log('added position ', addedPosition)
            let lat = this.state.currentPosition.latitude
            let lng = this.state.currentPosition.longitude
            // console.log('LAT LONG BEFORE ADDING ', lat, lng)
            let nextObj = {latitude: lat, longitude: lng}
            // let realAdded = Object.assign({}, addedPosition)
            // console.log('real real positon', realAdded)

	    			// let timeMarkerArr = this.state.timeMarker
	    			// timeMarkerArr.push(TimeFormatter(this.state.timer))
	    			newrouteCoords.push(nextObj)
	    			this.setState({
	    				routeCoords: newrouteCoords,
	    				// timeMarker: timeMarkerArr
	    			})
	    		}, 500)
    	}



    	}



  render() {


    const position = this.state.currentPosition;
    // console.log('this is the time marker', this.state.timeMarker)
    // console.log('this is the state', this.state)
    // console.log('this is the router coords', this.state.routeCoords)
  	const routerDisplayCoords = this.state.routeCoords.slice(0)
    console.log('DISPLAY COORDS', routerDisplayCoords)
    // let final;
    // let lat;
    // let lng;
    // let routerDisplayCoords1;


  // //   const getCorrectCoords = (routerDisplayCoords) => {
  //      if (routerDisplayCoords.length){
  //         routerDisplayCoords1 = routerDisplayCoords.map(coords => {
  //             lat = coords.latitude + 0
  //             lng = coords.longitude + 0
  //             return ({latitude: lat, longitude: lng})
  //         })
  //         console.log('this will return ', routerDisplayCoords1)
  //   }
  // }

  // routerDisplayCoords1 = [{latitude: 37.5, longitude: -122.5}, {latitude: 37.6, longitude: -122.6}, {latitude: 37.7, longitude: -122.7}]


   // }
   // console.log('THIS IS WHAT IS GOING TO BE PASSED IN', final)

    return (
      <View>
      	<View style={styles.mapcontainer}>
      		<View style={styles.startStop}>
      		<TouchableOpacity onPress={this.startStopButton}>
      			<Text>{this.state.isRunning ? 'Stop' : 'Start'}</Text>
      		</TouchableOpacity>
          {/* <TouchableOpacity onPress={this.testButton}>
            <Text>Get current position</Text>
          </TouchableOpacity> */}
      		</View>
      		<View style={styles.timer}>
      			<Text>{TimeFormatter(this.state.timer)}</Text>

      			<Text>{this.state.currentPosition.latitude}</Text>
      			<Text>{this.state.currentPosition.longitude}</Text>

      		</View>

       	 	<MapView
       	 		region={{latitude: position.latitude, longitude: position.longitude, latitudeDelta: .0005, longitudeDelta: .0005}}
			    style={styles.map}>

			 <MapView.Polyline coordinates={routerDisplayCoords} strokeColor='green' strokeWidth= {10} />



			 </MapView>
      	</View>

      </View>
    )
  }
}

export default MakeRoute
