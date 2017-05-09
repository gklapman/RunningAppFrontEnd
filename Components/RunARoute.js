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
import {promisifiedGetCurrPos, TestRunner, testRoute1, testRoute2 } from './Utils'

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
      saying: '',
			currentPosition: {latitude: 0, longitude: 0},

      selectedRoutePointer: 0,//this represents the index of the selected route coord (which is the !!!NEXT point!!! that the runner will be running to.. that we'll check)
      racerCoordsPointer: 0,//this represents index of the !!!NEXT POINT!!! that the phantom racer will get to (it's index of BOTH the selected route coord AND the racer's time array)
      racerTimesArrPointer: 1,

			isRunning: false,
      showStart: false,

  		timer: 0,
			timerStart: 0,
			timerEnd: 0,
			timeMarker: [],
		}
    this.startInterval
    this.interval
		this.startStopButton = this.startStopButton.bind(this)
    this.viewRoute = this.viewRoute.bind(this)
    this.testRunner = new TestRunner(testRoute2.convCoords, testRoute1.timesArr)
    this.testRunner.startTimer()
	}

  componentDidMount() {
    this.startInterval=setInterval(() => {
    // promisifiedGetCurrPos()//uncomment this (and comment this.testRunner below) if you want to take out test runner (and keep track of where the actual user is at)
    this.testRunner.moveAndGetPos()//uncomment this (and comment promisifiedGetCurrPos above) if you want to implement test runner
      .then(position=>{
        let lng = position.coords.longitude
        let lat = position.coords.latitude
        let newPosition = {latitude: lat, longitude: lng}

        let checkPoint=this.props.selectedRoute.convCoords[this.state.selectedRoutePointer];
        let dist=geolib.getDistance(checkPoint, newPosition);

        this.setState({
          currentPosition: newPosition
        })
        
        if(dist<25){
          this.setState({showStart: true});
        }
        else {
          this.setState({showStart: false});
        }
      })
      .catch(err=>console.log(err))
    }, 100);
  }

  componentWillUnmount(){
    clearInterval(this.startInterval)
    clearInterval(this.interval)
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
        //THIS BLOCK OF CODE IS FOR CHECKING IF USER IS AT A CERTAIN CHECKPOINT!!!!
        //-----------------------------------------------------------------------------
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

        // promisifiedGetCurrPos()//uncomment this (and comment this.testRunner.moveAndGetPos below) if you want to take out test runner (and keep track of where the actual user is at)
        this.testRunner.moveAndGetPos()//uncomment this (and comment promisifiedGetCurrPos above) if you want to implement test runner
          .then(position=>{
            let lng = position.coords.longitude
            let lat = position.coords.latitude
            let newPosition = {latitude: lat, longitude: lng}

            let checkPoint=this.props.selectedRoute.convCoords[this.state.selectedRoutePointer];
            let dist=geolib.getDistance(checkPoint, newPosition);
            // console.log('distance betwen checkpoint and current position: ', dist)
            if(dist<25){
              let timeMarker= this.state.timeMarker;
              timeMarker.push(this.state.timer)
              if(this.state.selectedRoutePointer===this.props.selectedRoute.convCoords.length-1){
                      clearInterval(this.interval)//this represents stopping the interval when a person has completed the run route
                      this.setState({
                        isRunning: false,
                    })

                    let convCoords = this.props.selectedRoute.convCoords;
                    let userId = this.props.user.id;
                    let timesArr = timeMarker;//Not in setState because we need it right away
                    let startTime = this.state.timerStart;
                    let endTime = Date.now();//Not in setState because we need it right away
                    let currentPosition = newPosition;//Not in setState because we need it right away

                    const { navigate } = this.props.navigation;
                    navigate('ViewRoute', {convCoords, userId, timesArr, startTime, endTime, currentPosition})
              }
              else{
                this.setState({selectedRoutePointer: this.state.selectedRoutePointer+1, timeMarker})
              }
            }

	    			this.setState({
	    				currentPosition: newPosition
	    			})
          })
          .catch(err=>console.error(err))

        // THIS BLOCK OF CODE IS FOR UPDATING PHANTOM RACER !!!!
        // -----------------------------------------------------------------------------
        // let selectedRacer= this.props.selectedRacer;// uncomment this when can get racer from store
        // sometimes phantom racer doesnt work if you click start too fast?  need to squash this bug
        let selectedRoutePointer= this.state.selectedRoutePointer
        let selectedRacer= this.props.selectedRacer
        let racerCoordsPointer= this.state.racerCoordsPointer
        let racerTimesArrPointer= this.state.racerTimesArrPointer
        let phantomRacerTimeToCheck= selectedRacer.routetimes[0].timesArr[racerTimesArrPointer]
        let phantomRacerCurrPos= this.props.selectedRoute.convCoords[racerCoordsPointer]

        if(this.state.timer > phantomRacerTimeToCheck-200 && this.state.timer < phantomRacerTimeToCheck+200){
          this.setState({racerCoordsPointer: racerCoordsPointer+1, racerTimesArrPointer: racerTimesArrPointer+1});
        }

        // console.log('phantomracer pointer: ', racerCoordsPointer, racerTimesArrPointer)
        // console.log('phantomracer position: ', phantomRacerCurrPos)

        let YOUREAHEAD='You are slightly ahead of the phantom racer!';
        let YOURENECKANDNECK='You are neck and neck with phantom racer!';
        let YOUREBEHIND='You are slightly behind the phantom racer... PICK UP THE PACE!';

        // console.log('comparing routepointer ', selectedRoutePointer-1, 'with racercoordspointer ', racerCoordsPointer)
        // console.log('(selectedRoutePointer)-racerCoordsPointer is ', (selectedRoutePointer)-racerCoordsPointer)

        if(selectedRoutePointer-racerCoordsPointer === 2 || selectedRoutePointer-racerCoordsPointer === 1 ){
          if(this.state.saying!==YOUREAHEAD) console.log(YOUREAHEAD);//we can change this parrt to make it cooler!  Make gabi do the voiceovers
          this.setState({saying: YOUREAHEAD});
        }
        else if((selectedRoutePointer)-racerCoordsPointer === 0 ){
          if(this.state.saying!==YOURENECKANDNECK) console.log(YOURENECKANDNECK);
          this.setState({saying: YOURENECKANDNECK});
        }
        else if(selectedRoutePointer-racerCoordsPointer === -2 || selectedRoutePointer-racerCoordsPointer === -1){
          if(this.state.saying!==YOUREBEHIND) console.log(YOUREBEHIND);
          this.setState({saying: YOUREBEHIND});
        }
            }, 100);
    	}
  	}

    viewRoute(){
        let convCoords = this.props.selectedRoute.convCoords;
        let userId = 1;
        let timesArr = this.state.timeMarker;
        let startTime = this.state.timerStart
        let endTime = this.state.timerEnd
        let currentPosition = this.state.currentPosition

        const { navigate } = this.props.navigation;
        navigate('ViewRoute', {convCoords, userId, timesArr, startTime, endTime, currentPosition})
    }

  render() {

    const position = this.state.currentPosition
    const convCoords= this.props.selectedRoute.convCoords
    const racerCoordsPointer= this.state.racerCoordsPointer
    const phantomRacerCurrPos= this.props.selectedRoute.convCoords[racerCoordsPointer]
    // console.log('phantom racer pos ',phantomRacerCurrPos)


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

      			<Text>{position.latitude}</Text>
      			<Text>{position.longitude}</Text>

      		</View>
       	 	<MapView
       	 		region={{latitude: position.latitude, longitude: position.longitude, latitudeDelta: .05, longitudeDelta: .05}}
			    style={styles.map}>

            { phantomRacerCurrPos && <MapView.Marker
              coordinate={phantomRacerCurrPos}
              pinColor='orange'
              title='phantom racer'
              identifier='3'
            />}

           <MapView.Marker coordinate={position} pinColor='purple' title='human runner' identifier={JSON.stringify(this.props.user.id)} />

    			 <MapView.Polyline coordinates={convCoords} strokeColor='green' strokeWidth= {5} />

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
    selectedRoute: state.selectedRoute,
    selectedRacer: state.selectedRacer,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(RunARoute)
