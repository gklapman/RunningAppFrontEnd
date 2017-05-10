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

      checkpointConvCoordsPointer: 2,//this represents the index of the selected route coord (which is the !!!NEXT point!!! that the runner will be running to.. that we'll check)
      phantomRacerPointer: 1,//this represents index of the !!!NEXT POINT!!! that the phantom phantomRacer will get to (it's index of BOTH the selected route coord AND the phantomRacer's time array)
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
          let newPosition = {latitude: lat, longitude: lng}

          newPosition= this.testRunner.moveAndGetPos().coords
          console.log('testrunner new position ', newPosition)

          let checkpoint = this.props.selectedRoute.checkpointConvCoords[this.state.checkpointConvCoordsPointer]
          let dist = geolib.getDistance(checkpoint, newPosition)
          // console.log('DIST', dist)


          if (dist < 1000 && this.state.checkpointConvCoordsPointer === 2){ //This will trigger the start button to show
            this.setState({showStart: true})
          }
          return this.setState({//not actually sure if this will actually wait for setState to complete before adding the BackgroundGeolocation onlocation listener.. we can put in the setState callback function later, if this causes problems
            currentPosition: newPosition
          })
        })
        .then(()=>{
          // console.log('inside of location checker and this is the state', this.state)
          BackgroundGeolocation.on('location', this.onLocation)
      })
        .catch(err => console.log(err))
    }

  onLocation(locInp){
    // console.log('onLoc listeners invoked (make sure this is NOT being run when outside components like makeroute and runaroute that need to watch location!)')
    let lng = locInp.coords.longitude
    let lat = locInp.coords.latitude
    let newPosition = {latitude: lat, longitude: lng}
     // axios.get(`https://roads.googleapis.com/v1/snapToRoads?path=${lat},%20${lng}&key=AIzaSyBlN-sYTlKuxuCHeOgX0wvj_L-iOxaLvwM`)
     // .then(res => {
        // let snappedLoc = res.data.snappedPoints[0].location
        // let newPosition = {latitude: snappedLoc.latitude, longitude: snappedLoc.longitude }

        newPosition= this.testRunner.moveAndGetPos().coords //this is for testtt delete later
        // console.log('testrunner newposition ', newPosition)

        this.setState({ currentPosition: newPosition })

        let checkpoint = this.props.selectedRoute.checkpointConvCoords[this.state.checkpointConvCoordsPointer]
        let dist = geolib.getDistance(checkpoint, newPosition)
        // console.log('DIST', dist)



        if (dist < 25 && this.state.checkpointConvCoordsPointer === 0){ //This will trigger the start button to show
          this.setState({showStart: true})
        }

        if(this.state.isRunning){



       

          let elapsedTime = Date.now() - this.state.timerStart

          let newpersonalCoords = this.state.personalCoords.slice(0)
          newpersonalCoords.push(newPosition)
          let newtimeMarker = this.state.personalTimeMarker.slice(0)
          newtimeMarker.push(elapsedTime)

          this.setState({
              timer: elapsedTime,
              personalCoords: newpersonalCoords,
              personalTimeMarker: newtimeMarker

          })

            if(dist < 25){
              let newcheckpointTimeMarker= this.state.checkpointTimeMarker.slice(0);
              newcheckpointTimeMarker.push(elapsedTime)

              if(this.state.checkpointConvCoordsPointer === this.props.selectedRoute.checkpointConvCoords.length-1){
                      this.setState({
                        isRunning: false,
                    })

              
                    let checkpointTimeMarker = newcheckpointTimeMarker
                    let personalCoords = newpersonalCoords
                    let personalTimeMarker = newtimeMarker
                    let userId = this.props.user.id
                    let startTime = this.state.timerStart
                    let endTime = Date.now()//Not in setState because we need it right away
                    let currentPosition = newPosition//Not in setState because we need it right away

                    const { navigate } = this.props.navigation;
                    navigate('ViewRoute', {checkpointTimeMarker, personalCoords, personalTimeMarker, userId, startTime, endTime, currentPosition, })
              }
              else{

                let YOUREAHEAD='You are slightly ahead of the phantom racer!';
                let YOURENECKANDNECK='You are neck and neck with phantom racer!';
                let YOUREBEHIND='You are slightly behind the phantom racer... PICK UP THE PACE!';


               let remainingDist = geolib.getPathLength(this.props.selectedRoute.checkpointConvCoords.slice(this.state.checkpointConvCoordsPointer))
               let phantomRemainingDist = geolib.getPathLength(this.props.selectedRacer.routetimes[0].personalCoords.slice(this.state.phantomRacerPointer))

               console.log('distances ', remainingDist, phantomRemainingDist )

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
            //PHANTOM RACER


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
    // })
    //  .catch(err => console.log(err))
  }


  // componentDidMount() {

  //   this.startInterval=setInterval(() => {
  //   // promisifiedGetCurrPos()//uncomment this (and comment this.testRunner below) if you want to take out test runner (and keep track of where the actual user is at)
  //   this.testRunner.moveAndGetPos()//uncomment this (and comment promisifiedGetCurrPos above) if you want to implement test runner
  //     .then(position=>{
  //       let lng = position.coords.longituderacer
  //       let lat = position.coords.latitude
  //       let newPosition = {latitude: lat, longitude: lng}

  //       let checkpoint=this.props.selectedRoute.convCoords[this.state.selectedRoutePointer];
  //       let dist=geolib.getDistance(checkpoint, newPosition);

  //       this.setState({
  //         currentPosition: newPosition
  //       })
        
  //       if(dist<25){
  //         this.setState({showStart: true});
  //       }
  //       else {
  //         this.setState({showStart: false});
  //       }
  //     })
  //     .catch(err=>console.log(err))
  //   }, 100);
  // }

  componentWillUnmount(){
    clearInterval(this.startInterval)
    clearInterval(this.interval)
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

        this.setState({
          isRunning: true,
          timerStart: Date.now()
        })

      }
    }

   //      // THIS BLOCK OF CODE IS FOR UPDATING PHANTOM RACER !!!!
   //      // -----------------------------------------------------------------------------
   //      // let selectedRacer= this.props.selectedRacer;// uncomment this when can get racer from store
   //      // sometimes phantom racer doesnt work if you click start too fast?  need to squash this bug
   //      

   //    
   //          }, 100);
   //  	}
  	// }

    viewRoute(){
        let personalCoords = this.state.personalCoords;
        let userId = this.state.user.id;
        let personalTimeMarker = this.state.personalTimeMarker;
        let startTime = this.state.timerStart
        let endTime = this.state.timerEnd
        let currentPosition = this.state.currentPosition
        let checkpointTimeMarker = this.state.checkpointTimeMarker

        const { navigate } = this.props.navigation;
        navigate('ViewRoute', {personalCoords, userId, personalTimeMarker, checkpointTimeMarker, startTime, endTime, currentPosition})
    }

  render() {

    const position = this.state.currentPosition
    const convCoords= this.props.selectedRoute.convCoords
    // console.log('this is the selectedRoute', this.props.selectedRoute)
    const phantomRacerPointer= this.state.phantomRacerPointer
    const phantomRacerCurrPos= this.props.selectedRacer.routetimes[0].personalCoords[phantomRacerPointer-1]
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
