//REACT MODULES
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
import {StackNavigator} from 'react-navigation';
import MapView from 'react-native-maps';
import {connect} from 'react-redux'
//MISC MODULES
import TimeFormatter from 'minutes-seconds-milliseconds'
import axios from 'axios'
//CUSTOM MODULES
import styles from '../Styles'
import {addNewRoute} from './storeAndReducer'


class MakeRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPosition: {latitude: 1, longitude: 2} , //THIS WILL BE TAKEN FROM THE STORE TO RENDER INITIAL RUNNER STATE
			isRunning: false,
			timer: 0,
			timerStart: 0,
			timerEnd: 0,
			routeCoords: [],
			timeMarker: [0]
		}
		this.startStopButton = this.startStopButton.bind(this)
    // this.submitRun = this.submitRun.bind(this)
    this.viewRoute = this.viewRoute.bind(this)
	}


  componentWillMount() {
    navigator.geolocation.getCurrentPosition((position) => {
              let lng = position.coords.longitude
              let lat = position.coords.latitude
              let newPosition = {latitude: lat, longitude: lng}

              this.setState({
                currentPosition: newPosition
              })
            })
  }

  startStopButton() {

  	// let intervalIncrease = 0.0005 //THIS IS PURELY FOR TESTING
  	// let intervalIncrease2 = 0.0007

    	if(this.state.isRunning){
    		clearInterval(this.interval)
    		clearInterval(this.recordInterval)
    		this.setState({
    			isRunning: false,
          timerEnd: Date.now()
    		})
    		return;
    	} else {

        let lat = this.state.currentPosition.latitude
        let lng = this.state.currentPosition.longitude
        let firstRouteCoord = [{latitude: lat, longitude: lng}]
	    		this.setState({
	    		isRunning: true,
	    		timerStart: Date.now(),
	    		routeCoords: firstRouteCoord

    		})
	    		this.interval = setInterval(() => {
		    	this.setState({
		    		timer: Date.now() - this.state.timerStart
		    	})
		    	navigator.geolocation.getCurrentPosition((position) => {
		    			let lng = position.coords.longitude
		    			let lat = position.coords.latitude
		    			let newPosition = {latitude: lat, longitude: lng}

		    			this.setState({
		    				currentPosition: newPosition
		    			})
		    		},
            (msg)=>alert('Please enable your GPS position future.'),
            {enableHighAccuracy: true},)
            }, 100);

	    		this.recordInterval = setInterval(() => {

	    			// intervalIncrease += 0.0005
	    			// intervalIncrease2 += 0.0003
            // console.log('CURRENT ROUTECORDS', this.state.routeCoords)
	    			// let adjustedLat = this.state.currentPosition.latitude + intervalIncrease
	    			// let adjustedLng = this.state.currentPosition.longitude + intervalIncrease2
	    			// let adjustedCoords =  { latitude: adjustedLat, longitude: adjustedLng }
	    			// //ADJUSTED COORDS IS ONLY FOR TESTING!!!!!! IT WILL REALLY PUSH IN CURRENT LOCATION
	    			// newrouteCoords.push(adjustedCoords)


            let newrouteCoords = this.state.routeCoords.slice(0)
            let lat = this.state.currentPosition.latitude
            let lng = this.state.currentPosition.longitude
            let nextObj = {latitude: lat, longitude: lng}
	    			newrouteCoords.push(nextObj)

            let timeMarkerArr = this.state.timeMarker
            timeMarkerArr.push(this.state.timer)

	    			this.setState({
	    				routeCoords: newrouteCoords,
	    				timeMarker: timeMarkerArr
	    			})
	    		// }, 500)
        }, 150)//PURELY FOR TESTING PURPOSES (mainly to get points on map on the way to and from class... uncomment the above later)
    	}
    	}


    viewRoute(){
        let convCoords = this.state.routeCoords;
        let userId = this.props.user.id;
        let timesArr = this.state.timeMarker;
        let startTime = this.state.timerStart
        let endTime = this.state.timerEnd
        let currentPosition = this.state.currentPosition

        const { navigate } = this.props.navigation;
        navigate('ViewRoute', {convCoords, userId, timesArr, startTime, endTime, currentPosition})

    }

    // viewRoute(){
    //     let convCoords = this.state.routeCoords;
    //     let userId = this.props.user.id;
    //     let timesArr = this.state.timeMarker;
    //     let startTime = this.state.timerStart
    //     let endTime = this.state.timerEnd
    //     let currentPosition = this.state.currentPosition
    //
    //     let completeRouteCoords = this.state.routeCoords.slice(0)//THIS IS JUST HERE TO TEST GEOLOCATION ACCURACY
    //
    //     const { navigate } = this.props.navigation;                                                // v This is passed just for testing, remove later
    //     navigate('Coordinates', {convCoords, userId, timesArr, startTime, endTime, currentPosition, completeRouteCoords})
    //
    // }

  render() {

    const position = this.state.currentPosition;
  	const routerDisplayCoords = this.state.routeCoords.slice(0)


    // console.log('this is the info ', this.state.isRunning, this.state.timerEnd)
    return (
      <View>
      	<View style={styles.mapcontainer}>
        {!this.state.isRunning && this.state.timerEnd !== 0 ?
          <View style={styles.viewRoute}>
                <TouchableOpacity onPress={this.viewRoute}>
                  <Text>View Run</Text>
                </TouchableOpacity>
            </View> :
            <View style={styles.startStop}>
              <TouchableOpacity onPress={this.startStopButton}>
                <Text>{this.state.isRunning ? 'Stop' : 'Start'}</Text>
              </TouchableOpacity>
           </View> }

      		<View style={styles.timer}>
      			<Text>{TimeFormatter(this.state.timer)}</Text>

      			<Text>{this.state.currentPosition.latitude}</Text>
      			<Text>{this.state.currentPosition.longitude}</Text>

      		</View>
       	 	<MapView
       	 		region={{latitude: position.latitude, longitude: position.longitude, latitudeDelta: .0005, longitudeDelta: .0005}}
			    style={styles.map}>

       {routerDisplayCoords.map((coord, idx) =>{
         let coord1=coord;
         let coord2={latitude:coord.latitude, longitude:coord.longitude+.001}
         let coord3={latitude:coord.latitude+.001, longitude:coord.longitude}
        //  let stringified = JSON.stringify(coord1)
        //  let easy2readCoords = stringified.slice()
        //  return(<MapView.Polygon coordinates={[coord1,coord2,coord3]} strokewidth={5}/>)
         return(<MapView.Marker coordinate={coord1} title={JSON.stringify(coord1)} key={''+idx}/>)
       })}

       {/* <MapView.Marker
         coordinate={{latitude: routeObj.convCoords[routeObj.convCoords.length-1].latitude, longitude: routeObj.convCoords[routeObj.convCoords.length-1].longitude}}
         pinColor='blue'
         title='End'
         identifier={routeID}
         onSelect={goToRaceView}
       /> */}






			 <MapView.Polyline coordinates={routerDisplayCoords} strokeColor='green' strokeWidth= {10} />

			 </MapView>
      	</View>

      </View>
    )
  }
}

const mapDispatchToProps = null

function mapStateToProps(state){
  return {
    user: state.user,
    currentLocation: state.currentLocation,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MakeRoute)
