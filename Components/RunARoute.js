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
import {promisifiedGetCurrPos} from './Utils'

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

      // convCoords: [],
			currentPosition: {latitude: 0, longitude: 0} , //THIS WILL BE TAKEN FROM THE STORE TO RENDER INITIAL RUNNER STATE

      selectedRoutePointer: 0,//this represents the index of the selected route coord (which is the !!!NEXT point!!! that the runner will be running to.. that we'll check)
      racerPointer: 0,//this represents index of the !!!NEXT POINT!!! that the phantom racer will get to (it's index of BOTH the selected route coord AND the racer's time array)

      testRunnerCoordinates: [{latitude: 37.785834,longitude:-122.406417},{latitude: 37,longitude:-121.3},{latitude: 36.2,longitude:-121},{latitude: 36.5,longitude:-120},{latitude: 36.29,longitude:-119.7},{latitude: 36.25,longitude:-119.5}],

			isRunning: false,
      showStart: false,

  		timer: 0,
			timerStart: 0,
			timerEnd: 0,
			timeMarker: [],
		}
		this.startStopButton = this.startStopButton.bind(this)
    this.viewRoute = this.viewRoute.bind(this)


//THIS IS FOR TESTING PURPOSES (BEFORE LINKING UP WITH STORE!!!) DELETE THIS SHIT AFTERWARD (and change all the this.testprops to this.props later in this component)
    this.testprops={};
    this.testprops.selectedRoute = {
    "convCoords":[{latitude:37.785834,longitude:-122.406417},{latitude:37,longitude:-121.3},{latitude:36.2,longitude:-121},{latitude:36.5,longitude:-120},{latitude:36.29,longitude:-119.7},{latitude:36.25,longitude:-119.5}],
    "id":1,
    "coords":[["37","-122"],["36.5","-121"],["36.25","-119.5"]],
    "createdAt":"2017-05-05T20:25:08.925Z",
    "updatedAt":"2017-05-05T20:25:08.925Z",
    "users":[]}
    this.testprops.selectedRacer =
        {
          "id":3,"email":"charles@charles.com",
          "password":"1234",
          "username":"charliieee",
          "city":"Chicago",
          "createdAt":"2017-05-05T20:25:08.890Z",
          "updatedAt":"2017-05-05T20:25:08.890Z",
          "groupId":null,
          "UserAndRoutes":{"createdAt":"2017-05-05T20:25:08.960Z","updatedAt":"2017-05-05T20:25:08.960Z","userId":3,"routeId":1},
          "routetimes":[
            {
              "convTimesArr":["0:00","0:00","0:00","0:00"],
              "runtime":20,
              "id":2,
              "timesArr":[0,2000,4000,6000,8000,10000],//Really strange the the timesArr elements come as numbers from the server, but the selectedRouteCoords thing comes as strings... but whatever
              "startTime":null,
              "endTime":null,
              "best":true,
              "createdAt":"2017-05-05T20:25:08.935Z",
              "updatedAt":"2017-05-05T20:25:08.995Z",
              "userId":3,"routeId":1
            }]
        }
	}

  // componentWillMount(){
  //   console.log('this.testprops is ', this.testprops)
  //   // below is TEST ROUTE... TAKE THIS OUT AND REPLACE WITH THIS.PROPS.COORDS LATER (OR SOMETHING) ONCE WE CAN ACCESS THE INFO FROM STORE
  //   // let testselectedRouteCoords = [["37.785834","-122.406417"],["37","-121.3"],["36.2","-121"],["36.5","-120"],["36.29","-119.7"],["36.25","-119.5"]];
  //   let convCoords= testselectedRouteCoords.map(locArr=>{
  //     return {latitude: +locArr[0], longitude: +locArr[1]}
  //   })
  //   this.setState({convCoords})
  //
  //   // below is TEST PHANTOM RACER ... TAKE THIS OUT AND REPLACE ONCE WE CAN ACCESS THE RACER FROM STORE
  //
  //   this.setState({testRacerDELETELATER: testselectedRacer});
  // }

  componentDidMount() {
    this.startInterval=setInterval(() => {
    navigator.geolocation.getCurrentPosition((position) => {
        let lng = position.coords.longitude
        let lat = position.coords.latitude
        let newPosition = {latitude: lat, longitude: lng}

        let checkPoint=this.testprops.selectedRoute.convCoords[this.state.selectedRoutePointer];
        let dist=geolib.getDistance(checkPoint, newPosition);

        this.setState({
          currentPosition: newPosition
        })
        if(1){
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

        promisifiedGetCurrPos()
          .then(position=>{
            let lng = position.coords.longitude
            let lat = position.coords.latitude
            let newPosition = {latitude: lat, longitude: lng}

            let checkPoint=this.testprops.selectedRoute.convCoords[this.state.selectedRoutePointer];
            let dist=geolib.getDistance(checkPoint, newPosition);
            if(dist<25){
              let timeMarker= this.state.timeMarker;
              timeMarker.push(this.state.timer)
              if(this.state.selectedRoutePointer===this.testprops.selectedRoute.convCoords.length-1){
                clearInterval(this.interval)//this represents stopping the interval when a person has completed the run route
                this.setState({
                  isRunning: false,
              })

              let convCoords = this.testprops.selectedRoute.convCoords;
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

	    	// navigator.geolocation.getCurrentPosition((position) => {
        //   let lng = position.coords.longitude
        //   let lat = position.coords.latitude
        //   let newPosition = {latitude: lat, longitude: lng}
        //   // let newPosition = this.state.testRunnerCoordinates[this.state.selectedRoutePointer];
        //   // console.log('new position is ', newPosition);
        //   // console.log('selected route pointer: ', this.state.selectedRoutePointer)
        //
        //   let checkPoint=this.testprops.selectedRoute.convCoords[this.state.selectedRoutePointer];
        //
        //   let dist=geolib.getDistance(checkPoint, newPosition);
        //
        //     if(dist<25){
        //       let timeMarker= this.state.timeMarker;
        //       timeMarker.push(this.state.timer)
        //       if(this.state.selectedRoutePointer===this.testprops.selectedRoute.convCoords.length-1){
        //         clearInterval(this.interval)//this represents stopping the interval when a person has completed the run route
        //         this.setState({
        //           isRunning: false,
        //         })
        //
        //       let convCoords = this.testprops.selectedRoute.convCoords;
        //       let userId = this.props.user.id;
        //       let timesArr = timeMarker;//Not in setState because we need it right away
        //       let startTime = this.state.timerStart;
        //       let endTime = Date.now();//Not in setState because we need it right away
        //       let currentPosition = newPosition;//Not in setState because we need it right away
        //
        //       const { navigate } = this.props.navigation;
        //       navigate('ViewRoute', {convCoords, userId, timesArr, startTime, endTime, currentPosition})
        //       }
        //       else{
        //         this.setState({selectedRoutePointer: this.state.selectedRoutePointer+1, timeMarker})
        //       }
        //     }
	    	// 		this.setState({
	    	// 			currentPosition: newPosition
	    	// 		})
    		// },
        // (msg)=>alert('Please enable your GPS position future.'),
        // {enableHighAccuracy: true},)

        // THIS BLOCK OF CODE IS FOR UPDATING PHANTOM RACER !!!!
        // -----------------------------------------------------------------------------
        // let selectedRacer= this.props.selectedRacer;// uncomment this when can get racer from store
        // sometimes phantom racer doesnt work if you click start too fast?  need to squash this bug
        let selectedRoutePointer= this.state.selectedRoutePointer;
        let selectedRacer= this.testprops.selectedRacer;
        let racerPointer= this.state.racerPointer;
        let phantomRacerTimeToCheck= selectedRacer.routetimes[0].timesArr[racerPointer];
        let phantomRacerCurrPos= this.testprops.selectedRoute.convCoords[racerPointer];

        if(this.state.timer > phantomRacerTimeToCheck-200 && this.state.timer < phantomRacerTimeToCheck+200){
          this.setState({racerPointer: racerPointer+1});
        }

        let YOUREAHEAD='You are slightly ahead of the phantom racer!';
        let YOURENECKANDNECK='You are neck and neck with phantom racer!';
        let YOUREBEHIND='You are slightly behind the phantom racer... PICK UP THE PACE!';

        if(selectedRoutePointer-racerPointer === 2 || 1 ){
          if(this.state.saying!==YOUREAHEAD) console.log(YOUREAHEAD);//we can change this parrt to make it cooler!  Make gabi do the voiceovers
          this.setState({saying: YOUREAHEAD});
        }
        else if(selectedRoutePointer-racerPointer === 0 ){
          if(this.state.saying!==YOURENECKANDNECK) console.log(YOURENECKANDNECK);
          this.setState({saying: YOURENECKANDNECK});
        }
        else if(selectedRoutePointer-racerPointer === -2 || -1 ){
          if(this.state.saying!==YOUREBEHIND) console.log(YOUREBEHIND);
          this.setState({saying: YOUREBEHIND});
        }
            }, 100);
    	}
  	}

    viewRoute(){
        let convCoords = this.testprops.selectedRoute.convCoords;
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
    const convCoords= this.testprops.selectedRoute.convCoords;
    // console.log('convCoords is ',convCoords)
    // console.log('this.state.racePointer is ', this.state.racerPointer)
    // console.log('convCoords[this.state.racerPointer-1] is ', convCoords[this.state.racerPointer-1])
    const racerMarkerLoc= this.state.racerPointer ? convCoords[this.state.racerPointer-1] : null;
    // console.log('phantom racer should be at this loc: ', racerMarkerLoc)

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
       	 		region={{latitude: position.latitude, longitude: position.longitude, latitudeDelta: 4, longitudeDelta: 4}}
			    style={styles.map}>

            { racerMarkerLoc && <MapView.Marker
              coordinate={racerMarkerLoc}
              pinColor='orange'
              title='phantom racer'
              identifier='3'
            />}

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
    // selectedRoute: state.selectedRoute,//Uncomment these after we can receive from store (and then delete the test props in gotoRunARoute (in the run component)
    // selectedRacer: state.selectedRacer,//Uncomment these after we can receive from store (and then delete the test props in gotoRunARoute (in the run component)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(RunARoute)
