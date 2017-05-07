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
import geolib from 'geolib'
//CUSTOM MODULES
import styles from '../Styles'
import {addNewRoute} from './storeAndReducer'


//Data that this component will receive as props (statewise) (either from store or directly passed in from the run component):

//selected route: [["37.785834","-122.406417"],["37","-121.3"],["36.2","-121"],["36.5","-120"],["36.29","-119.7"],["36.25","-119.5"]];
//selected racer (user), with associated routetime //who you are racing against:
//current user


//Dispatch functions this component will receive as props
//addNewRoute

//TO DO:

//Make sure.. when user clicks start.. check if at starting point //good?
//if at starting point, SET A COUNTDOWN..
//once runner has gotten to the final checkpoint... do some ending thing  //

//take out the test button thing when alyssa's thunk thing is working


class RunARoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
      convCoords: [],
			currentPosition: {latitude: 1, longitude: 2} , //THIS WILL BE TAKEN FROM THE STORE TO RENDER INITIAL RUNNER STATE
			isRunning: false,
      selectedRoutePointer: 0,//this represents the index of the selected route coord (which is the next point that the runner will be running to.. that we'll check)
      showStart: false,
  		timer: 0,
			timerStart: 0,
			timerEnd: 0,
			timeMarker: [],
		}
		this.startStopButton = this.startStopButton.bind(this)
    this.viewRoute = this.viewRoute.bind(this)

	}

  componentWillMount(){
    let selectedRouteCoords = [["37.785834","-122.406417"],["37","-121.3"],["36.2","-121"],["36.5","-120"],["36.29","-119.7"],["36.25","-119.5"]];
    let convCoords= selectedRouteCoords.map(locArr=>{
      return {latitude: +locArr[0], longitude: +locArr[1]}
    })
    this.setState({convCoords})
  }

  componentDidMount() {
    this.startInterval=setInterval(() => {
    navigator.geolocation.getCurrentPosition((position) => {
              let lng = position.coords.longitude
              let lat = position.coords.latitude
              let newPosition = {latitude: lat, longitude: lng}

              let checkPoint=this.state.convCoords[this.state.selectedRoutePointer];
              let dist=geolib.getDistance(checkPoint, newPosition);

              this.setState({
                currentPosition: newPosition
              })
              if(dist){
                this.setState({showStart: true});
              }
              else {
                this.setState({showStart: false});
              }
            })
          }, 100);
  }

  startStopButton() {

      clearInterval(this.startInterval)
    	if(this.state.isRunning){
    		clearInterval(this.interval)//this represents stopping the interval when a person manually chooses to stop by clicking the stop button (end early)
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
    		})
	    		this.interval = setInterval(() => {
		    	this.setState({
		    		timer: Date.now() - this.state.timerStart
		    	})
		    	navigator.geolocation.getCurrentPosition((position) => {
            let lng = position.coords.longitude
            let lat = position.coords.latitude
            let newPosition = {latitude: lat, longitude: lng}

            let checkPoint=this.state.convCoords[this.state.selectedRoutePointer];
            // console.log('on this index of convcoords: ', this.state.selectedRoutePointer);
            // console.log('comparing current checkpoint ',checkPoint,' with new position ',newPosition)

            let dist=geolib.getDistance(checkPoint, newPosition);

              if(dist>25){
                let timeMarker= this.state.timeMarker;
                // console.log('timesArr was ', this.state.timeMarker)
                timeMarker.push(this.state.timer)
                // console.log('timesArr is now ', this.state.timeMarker)
                if(this.state.selectedRoutePointer===this.state.convCoords.length-1){
                  clearInterval(this.interval)//this represents stopping the interval when a person has completed the run route
                  // console.log('convcoords ',this.state.convCoords.length)
                  // console.log('this.state.selectedRoutePointer' , this.state.selectedRoutePointer)
                  this.setState({
                    isRunning: false,
                  })

                let convCoords = this.state.convCoords;
                let userId = this.props.user.id;
                let timesArr = timeMarker;//Not in setState because we need it right away
                let startTime = this.state.timerStart;
                let endTime = Date.now();//Not in setState because we need it right away
                let currentPosition = newPosition;//Not in setState because we need it right away

                // console.log('timesArr ',timesArr, 'convcoords ', this.state.convCoords)
                const { navigate } = this.props.navigation;
                // console.log('before navigate')
                navigate('ViewRoute', {convCoords, userId, timesArr, startTime, endTime, currentPosition})
                }
                else{
                  this.setState({selectedRoutePointer: this.state.selectedRoutePointer+1, timeMarker})
                }
              }
		    			this.setState({
		    				currentPosition: newPosition
		    			})
		    		},
            (msg)=>alert('Please enable your GPS position future.'),
            {enableHighAccuracy: true},)
            }, 100);
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

    const position = this.state.currentPosition;

    return (
      <View>
      	<View style={styles.mapcontainer}>

        {!this.state.isRunning && this.state.timerEnd !== 0 ?
          <View style={styles.viewRoute}>
                <TouchableOpacity onPress={this.viewRoute}>
                  <Text>View Run</Text>
                </TouchableOpacity>
            </View> : this.state.showStart ?

            <View style={styles.startStop}>
              <TouchableOpacity onPress={this.startStopButton}>
                <Text>{this.state.isRunning ? 'Stop' : 'Start'}</Text>
              </TouchableOpacity>
           </View> : null }

      		<View style={styles.timer}>
      			<Text>{TimeFormatter(this.state.timer)}</Text>

      			<Text>{this.state.currentPosition.latitude}</Text>
      			<Text>{this.state.currentPosition.longitude}</Text>

      		</View>
       	 	<MapView
       	 		region={{latitude: position.latitude, longitude: position.longitude, latitudeDelta: .5, longitudeDelta: .5}}
			    style={styles.map}>

			 <MapView.Polyline coordinates={
         this.state.convCoords.map(function(coordPair){
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
    user: state.user,
    selectedRouteCoords: state.selectedRouteCoords,
    selectedRouteTimes: state.selectedRouteTimes,

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(RunARoute)
