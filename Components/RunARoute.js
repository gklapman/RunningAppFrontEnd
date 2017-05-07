
//Data that this component will receive as props (statewise) (either from store or directly passed in from the run component):

//selected route
//selected racer (user), with associated routetime //who you are racing against
//current user


//Dispatch functions this component will receive as props
//addNewRoute

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
import axios from 'axios'
import {connect} from 'react-redux'
import {addNewRoute} from './storeAndReducer.js'
import geolib from 'geolib'

//Make sure.. when user clicks start.. check if at starting point
//if at starting point, SET A COUNTDOWN..
//once runner has gotten to the final checkpoint... do some ending thing

//take out the test button thing when alyssa's thunk thing is working

class RunARoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPosition: {latitude: 1, longitude: 2} , //THIS WILL BE TAKEN FROM THE STORE TO RENDER INITIAL RUNNER STATE
			isRunning: false,
      selectedRoutePointer: 1,//this represents the index of the selected route coord (which is the next point that the runner will be running to.. that we'll check)
			timer: 0,
			timerStart: 0,
			timerEnd: 0,
			timeMarker: [0]
		}
		this.startStopButton = this.startStopButton.bind(this)
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

        // const selectedRoute = this.props.selectedRoute; //this will be once we are able to get selectedRoute from store


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
              let selectedRouteCoords = [["37.785834","-122.406417"],["36.5","-121"],["36.25","-119.5"]];
		    			let lng = position.coords.longitude
		    			let lat = position.coords.latitude
		    			let newPosition = {latitude: lat, longitude: lng}

              let nextCheckPointUnconverted= selectedRouteCoords[this.state.selectedRoutePointer];
              console.log('next checkpoint unconv', nextCheckPointUnconverted);
              let nextCheckPoint={latitude: nextCheckPointUnconverted[0], longitude: nextCheckPointUnconverted[1]};
              console.log('next checkpoint', nextCheckPoint)
              let dist=geolib.getDistance(nextCheckPoint, newPosition);

              if(dist>25){
                let timeMarker= this.state.timeMarker;
                timeMarker.push(this.state.timer)
                this.setState({selectedRoutePointer: this.state.selectedRoutePointer+1, timeMarker}, ()=>console.log(this.state))
              }

		    			this.setState({
		    				currentPosition: newPosition
		    			})


		    		},
            (msg)=>alert('Please enable your GPS position future.'),
            {enableHighAccuracy: true},)
            }, 100);



	    		// this.recordInterval = setInterval(() => {
          //   let newrouteCoords = this.state.routeCoords.slice(0)
          //   let lat = this.state.currentPosition.latitude
          //   let lng = this.state.currentPosition.longitude
          //   let nextObj = {latitude: lat, longitude: lng}
	    		// 	newrouteCoords.push(nextObj)
          //
          //   let timeMarkerArr = this.state.timeMarker
          //   timeMarkerArr.push(this.state.timer)
          //
	    		// 	this.setState({
	    		// 		routeCoords: newrouteCoords,
	    		// 		timeMarker: timeMarkerArr
	    		// 	})
	    		// }, 500)


    	}
    	}


    viewRoute(){
        let convCoords = this.state.routeCoords;
        let userId = 1;
        let timesArr = this.state.timeMarker;
        let startTime = this.state.timerStart
        let endTime = this.state.timerEnd
        let currentPosition = this.state.currentPosition

         const { navigate } = this.props.navigation;
        navigate('ViewRoute', {convCoords, userId, timesArr, startTime, endTime, currentPosition})

    }




  render() {

    // const selectedRoute = this.props.selectedRoute; //this will be once we are able to get selectedRoute from store
    const selectedRouteCoords = [["37.785834","-122.406417"],["36.5","-121"],["36.25","-119.5"]];

    const position = this.state.currentPosition;

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
       	 		region={{latitude: position.latitude, longitude: position.longitude, latitudeDelta: .5, longitudeDelta: .5}}
			    style={styles.map}>

			 <MapView.Polyline coordinates={
         selectedRouteCoords.map(function(coordPair){
           return {latitude: coordPair[0], longitude: coordPair[1]}
          })
         } strokeColor='green' strokeWidth= {10} />

			 </MapView>
      	</View>

      </View>
    )
  }
}

const mapDispatchToProps = null

function mapStateToProps(state){
  return {
    selectedRouteCoords: state.selectedRouteCoords,
    selectedRouteTimes: state.selectedRouteTimes,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(RunARoute)
