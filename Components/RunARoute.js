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
import BackgroundGeolocation from "react-native-background-geolocation";
//MISC MODULES
import TimeFormatter from 'minutes-seconds-milliseconds'
import axios from 'axios'
import geolib from 'geolib'

//CUSTOM MODULES
import styles from '../Styles'
import {addNewRoute} from './storeAndReducer'
import {promisifiedGetCurrPos, TestRunner, testRoute1, testRoute2, testRoute3 } from './Utils'

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



//INFO WE NEED:
// checkpointConvCords - this.props.selectedRoute.checkpointConvCoords
// checkpointTimeMarkerCoords (phantom) - this.props.selectedRacer.checkpointTimeMarkerCoords /// ??? should we get phantom checkpoints time markers or phantom personalTimemarkers (and phantom personalCoords?)



class RunARoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
      saying: '',
			currentPosition: {latitude: 0, longitude: 0},

      checkpointConvCoordsPointer: 1,//this represents the index of the selected route coord (which is the !!!NEXT point!!! that the runner will be running to.. that we'll check)
      phantomRacerPointer: 1,//this represents index of the !!!NEXT POINT!!! that the phantom phantomRacer will get to (it's index of BOTH the selected route coord AND +1 the phantomRacer's time array)
      // phantomRacerTimesArrPointer: 1,

			isRunning: false,
      showStart: false,

  		timer: 0,
			timerStart: 0,
			timerEnd: 0,
			personalTimeMarker: [],
      checkpointTimeMarker: [],
      personalCoords: [],
		}
    this.startInterval
    this.interval
		this.startStopButton = this.startStopButton.bind(this)
    this.viewRoute = this.viewRoute.bind(this)
    this.testRunner = new TestRunner(testRoute3.convCoords, testRoute3.timesArr)
    this.testRunner.startTimer()
    this.onLocation = this.onLocation.bind(this)
	}


   componentWillMount() {
      let phantomRacerCurrPos;
      promisifiedGetCurrPos()//BackgroundGeolocation is still far superior to navigator.geolocation.getCurrentPosition, but the latter is still good to use for getting position at a specified time
        .then((position) => {
          // console.log('here')
          let lng = position.coords.longitude
          let lat = position.coords.latitude
          position = {latitude: lat, longitude: lng}

          position= this.testRunner.moveAndGetPos().coords//for testrunner.. get rid of this if it you dont need it

          let initialcheckpoint = this.props.selectedRoute.checkpointConvCoords[0]
          let dist = geolib.getDistance(initialcheckpoint, position)
          // console.log('DIST', dist)

          if (dist < 50 && this.state.checkpointConvCoordsPointer === 1){ //This will trigger the start button to show
            this.setState({
              showStart: true,
            })
          }
          return this.setState({//not actually sure if this will actually wait for setState to complete before adding the BackgroundGeolocation onlocation listener.. we can put in the setState callback function later, if this causes problems
            currentPosition: position
          })
        })
        .then(()=>{
          // console.log('inside of location checker and this is the state', this.state)
          BackgroundGeolocation.on('location', this.onLocation)
      })
        .catch(err => console.log(err))
    }

  onLocation(locInp){
    console.log('onlocation... ')

    let lng = locInp.coords.longitude
    let lat = locInp.coords.latitude
    let rawPosition = {latitude: lat, longitude: lng}


    axios.get(`https://roads.googleapis.com/v1/snapToRoads?path=${lat},%20${lng}&key=AIzaSyBO0ViHL_ISFrF1Cizq5gZkmPhcyMk93dM`)
      .then(res => {
         // console.log('in snappedLoc block')
         let snappedLoc= res.data.snappedPoints[0].location
         let snappedPosition = {latitude: snappedLoc.latitude, longitude: snappedLoc.longitude }
         return snappedPosition
       })
      .catch(err => {
        if(err.message.includes('code 429') || err.message.includes('Network Error')){return rawPosition}//if googleapis returns a code 429 error (meaning we've reached our daily limit for requests), just return the rawposition
        else {throw err.message}
      })
      .then(position=>{
        position= this.testRunner.moveAndGetPos().coords //this is for testtt delete later
        // console.log('testrunner newposition ', position)
        this.setState({ currentPosition: position })

        let checkpoint = this.props.selectedRoute.checkpointConvCoords[this.state.checkpointConvCoordsPointer]
        let dist = geolib.getDistance(checkpoint, position)
        // console.log('position is ', position)
        // console.log('checkpoint is ',checkpoint)
        // console.log('DIST', dist)

        // THIS BLOCK OF CODE IS CHECKING IF USER IS AT THE **STARTING** CHECKPOINT (TO DISPLAY START BUTTON)
        // -----------------------------------------------------------------------------
        // console.log('isrunning ', this.state.isRunning, 'convcoordspoiter ', this.state.checkpointConvCoordsPointer)
        if(!this.state.isRunning && this.state.checkpointConvCoordsPointer === 1){
          let initialcheckpoint = this.props.selectedRoute.checkpointConvCoords[0]
          let dist = geolib.getDistance(initialcheckpoint, position)
          if (dist < 50 ){
            this.setState({showStart: true})
          }
          else if(dist >= 50){//this is to ensure the button would also stop showing if user has NOT started running, AND LEFT the starting checkpoint
            this.setState({showStart: false})
          }
        }
        else if(this.state.isRunning){

        // THIS BLOCK OF CODE IS FOR UPDATING ELAPSED TIME, PERSONALCOORDS, AND PERSONALTIMEMARKER (ONCE USER HAS STARTED RUNNING)
        // -----------------------------------------------------------------------------
          let elapsedTime = Date.now() - this.state.timerStart

          let newpersonalCoords = this.state.personalCoords.slice(0)
          newpersonalCoords.push(position)
          let newtimeMarker = this.state.personalTimeMarker.slice(0)
          newtimeMarker.push(elapsedTime)

          this.setState({
              timer: elapsedTime,
              personalCoords: newpersonalCoords,
              personalTimeMarker: newtimeMarker,
          })

          // THIS BLOCK OF CODE IS FOR CHECKING IF USER HIT A CHECKPOINT!!!!
          // -----------------------------------------------------------------------------

            if(dist < 50){
              let newcheckpointTimeMarker= this.state.checkpointTimeMarker.slice(0);
              newcheckpointTimeMarker.push(elapsedTime)

              // THIS BLOCK OF CODE IS FOR CHECKING IF USER HIT THE FINAL CHECKPOINT!!!!
              // -----------------------------------------------------------------------------

              if(this.state.checkpointConvCoordsPointer === this.props.selectedRoute.checkpointConvCoords.length-1){
                      this.setState({
                        isRunning: false,
                    })

                    let oldRoute = true
                    let phantomRacerRouteTimeId = this.props.selectedRacer.id //should this be the routetimeID of the opponent?
                    let checkpointTimeMarker = newcheckpointTimeMarker
                    let personalCoords = newpersonalCoords
                    let personalTimeMarker = newtimeMarker
                    let userId = this.props.user.id
                    let startTime = this.state.timerStart
                    let endTime = Date.now()//Not in setState because we need it right away
                    // let currentPosition = position //Not going to pass in the new position because we will view the route based on the start position

                    const { navigate } = this.props.navigation;
                    BackgroundGeolocation.un('location', this.onLocation)//not sure why, but navigating to another component unmounts it
                    navigate('ViewRoute', {checkpointTimeMarker, personalCoords, personalTimeMarker, userId, startTime, endTime, oldRoute, phantomRacerRouteTimeId})
              }
              else{

                // THIS BLOCK OF CODE IS UPDATING USER ABOUT WHERE HE/SHE IS IN RELATION TO PHANTOM RACER !!!!
                // -----------------------------------------------------------------------------

                let YOUREAHEAD='You are slightly ahead of the phantom racer!';
                let YOURENECKANDNECK='You are neck and neck with phantom racer!';
                let YOUREBEHIND='You are slightly behind the phantom racer... PICK UP THE PACE!';

                let remainingDist = geolib.getPathLength(this.props.selectedRoute.checkpointConvCoords.slice(this.state.checkpointConvCoordsPointer))
                let phantomRemainingDist = geolib.getPathLength(this.props.selectedRacer.routetimes[0].personalCoords.slice(this.state.phantomRacerPointer))

                // console.log('distances ', remainingDist, phantomRemainingDist )

       //      // console.log('comparing routepointer ', selectedRoutePointer-1, 'with racercoordspointer ', racerCoordsPointer)
       //      // console.log('(selectedRoutePointer)-racerCoordsPointer is ', (selectedRoutePointer)-racerCoordsPointer)

              if(remainingDist-phantomRemainingDist < -50 && remainingDist-phantomRemainingDist > -150){
                if(this.state.saying!==YOUREAHEAD) console.log(YOUREAHEAD);//we can change this parrt to make it cooler!  Make gabi do the voiceovers
                this.setState({saying: YOUREAHEAD});
              }
              else if(remainingDist-phantomRemainingDist < 50 && remainingDist-phantomRemainingDist > -50 ){
                if(this.state.saying!==YOURENECKANDNECK) console.log(YOURENECKANDNECK);
                this.setState({saying: YOURENECKANDNECK});
              }
              else if(remainingDist-phantomRemainingDist > 50 && remainingDist-phantomRemainingDist < 150){
                if(this.state.saying!==YOUREBEHIND) console.log(YOUREBEHIND);
                this.setState({saying: YOUREBEHIND});
              }

                this.setState({checkpointConvCoordsPointer: this.state.checkpointConvCoordsPointer+1, checkpointTimeMarker: newcheckpointTimeMarker})
              }
            }
             // THIS BLOCK OF CODE IS FOR UPDATING PHANTOM RACER !!!!
             // -----------------------------------------------------------------------------

            let phantomRacerPointer= this.state.phantomRacerPointer
            let phantomRacerTimeMarker = this.props.selectedRacer.routetimes[0].personalTimeMarker
            let phantomRacerCoords = this.props.selectedRacer.routetimes[0].personalCoords

            while (this.state.timer >= phantomRacerTimeMarker[phantomRacerPointer]){
              phantomRacerPointer++
            }
          // let phantomRacerCurrPos = phantomRacerCoords[phantomRacerPointer-1]
          // console.log('phantomRacerPointer', phantomRacerPointer, this.state.phantomRacerPointer)
          this.setState({phantomRacerPointer: phantomRacerPointer});
        }
      })
      .catch(err => console.log(err))
  }

  componentWillUnmount(){
    BackgroundGeolocation.un('location', this.onLocation)
    clearInterval(this.timerInterval)
  }

  startStopButton() {

    	if(this.state.isRunning){
    		//this represents stopping the interval when a person manually chooses to stop by clicking the stop button (end early)
    		this.setState({
    			isRunning: false,
          timerEnd: Date.now()
    		})
    		return;
    	} else {
        this.timerInterval = setInterval (()=> {//purely for visual purposes
          this.setState({timer: Date.now() - this.state.timerStart})//it's okay if it's asynchronous.. it'll update with the correct number the second timerState has been set (in the setState below)
        }, 50)

        this.setState({
          isRunning: true,
          timerStart: Date.now()
        })

      }
    }

    viewRoute(){
        let personalCoords = this.state.personalCoords
        let userId = this.props.user.id
        let personalTimeMarker = this.state.personalTimeMarker
        let startTime = this.state.timerStart
        let endTime = this.state.timerEnd
        let currentPosition = this.state.currentPosition
        let checkpointTimeMarker = this.state.checkpointTimeMarker
        let phantomRacerRouteTimeId = this.props.selectedRacer.id

        const { navigate } = this.props.navigation;
        navigate('ViewRoute', {personalCoords, userId, personalTimeMarker, checkpointTimeMarker, startTime, endTime, phantomRacerRouteTimeId })
    }

  render() {

    const position = this.state.currentPosition
    const convCoords= this.props.selectedRoute.convCoords
    // THIS DOES NOT REPRESENT PERSONAL COORDINATES.. BUT THE "OFFICIAL COORDINATES" (MADE BY FIRST THE USER THAT CREATED THE ROUTE)

    const checkpointConvCoords= this.props.selectedRoute.checkpointConvCoords
    // A USER DOES NOT HAVE TO MATCH OFFICIAL COORDINATES TO FINISH THE RACE... ONLY MEET THE CHECKPOINTS
    // console.log('checkpointConvCoords ',checkpointConvCoords)

    const phantomRacerPointer= this.state.phantomRacerPointer
    const phantomRacerCurrPos= this.props.selectedRacer.routetimes[0].personalCoords[phantomRacerPointer-1]
    // console.log('phantom racer pos ',phantomRacerCurrPos)
    // console.log('selectedRacer', this.props.selectedRacer)

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

            {checkpointConvCoords.map(checkPoint=>{
              return (<MapView.Marker coordinate={checkPoint} pinColor='black' title='checkpoint' />)
            })
            }

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
