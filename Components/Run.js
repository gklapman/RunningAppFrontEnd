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
//CUSTOM MODULES
import styles from '../Styles'
import {fetchNearbyRoutes, fetchSelectedRoute} from './storeAndReducer'
import RunARoute from './RunARoute';
import BackgroundGeolocation from "react-native-background-geolocation";


class Run extends Component {
  constructor(){
    super();
    this.canMakeRequests= false;
    this.scrollWaitInterval;
    this.onRegionChange=this.onRegionChange.bind(this);
  }

  // onMotionChange(){
  //   console.log("motion changed.... ???????")
  // }
  //
  // onLocation(locInp){
  //   console.log('location???', locInp)
  // }

  componentWillMount(){
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      stationaryRadius: 25,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle. //DISABLE FOR PRESENTATION??
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: true,   // <-- Allow the background-service to continue tracking when user closes the app. //KEEP THIS ON TRUE... DO NOT FORGET ABOUT THIS
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up. //WE MAY NEED TO HAVE THIS TURNED OFF UNTIL THIS RUN COMPONENT MOUNTS (otherwise a lot of events emitted with no listeners, causing some yellow warnings)
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    }, function(state) {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      }
    });

    // BackgroundGeolocation.on('motionchange', this.onMotionChange);
    // BackgroundGeolocation.on('location', this.onLocation)
  }

  componentWillUnmount(){
    // BackgroundGeolocation.un('motionchange', this.onMotionChange);
    // BackgroundGeolocation.un('location', this.onLocation)
  }

  onRegionChange(region) {
    //for onRegionChange... to prevent too many axios requests being made as a user is scrolling...  this is NOT part of state, and will NOT be changed via setState, because setting state may be too slow
    this.canMakeRequests=true;
    clearInterval(this.scrollWaitInterval);//this clears the LAST interval set
    this.scrollWaitInterval=setInterval(() => {//this now sets a new interval
      if(this.props && this.canMakeRequests) this.props.fetchNearbyRoutes(region);//this thunk will run AFTER .5 seconds, assuming the interval was not cleared by then (clears if user keeps scrolling), AND this.canMakeRequests is set to true
      this.canMakeRequests= false;//set to false so that the axios request does not keep happening after the scrolling has stopped and fetchNearbyRoutes has already run once
    },500)
    // console.log('this.props is ',this.props);
  }

  render() {

  	const { navigate } = this.props.navigation;

    const gotoRouteSelect = () => Actions.routeSelectPage({text: 'this goes to route select page!'});

    let routesArr = this.props.nearbyRoutes;

    // console.log("THIS PROPS here", this.props)

    // const routesArr= navigation.state.params.routesArr; //uncomment this once we are able to get the routes from props

    // const polyLineArr=[{latitude: 37, longitude: -122},{latitude: 36, longitude: -119}];  //example of something you can pass into Polyline as coordinates (as props)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
      })

    // const gotoRunARoute = () => {  //DELETE WHEN THINGS WORK
    // 	navigate('RunARoute')
   // 	}

    const goToRouteMaker = () => {
    	navigate('MakeRoute')
   	}

    const goToChooseYourOpponent = (evt) => {
      const routeID = ''+evt.nativeEvent.id
      this.props.fetchSelectedRoute(routeID)
      navigate('ChooseYourOpponent')
    }

    const filter = () => {
    	// console.log('this will be for filters')
    }

    return (
      <View>

        <View style={styles.mapcontainer}>

        	<View style={styles.createRoute}>
       	 		<Button
              onPress={goToRouteMaker}
              title="Create a Route">
            </Button>
       	 		</View>
       	 		<View style={styles.filter}>
       	 		<Button onPress={filter} title="Filter Your Routes"></Button>
       	 		</View>

       	 	<MapView style={styles.map} onRegionChange={this.onRegionChange}>

            {/* {alyssaTestRun.map(coordpair=>{
              let coord= {latitude:+coordpair[0], longitude:+coordpair[1]}
              return(<MapView.Marker coordinate={coord} />)
            })} // this is for testing routes that we tried on our phones */}

          {routesArr.map(routeObj=>{
            let routeID = ""+routeObj.id;

            return(
              <View key={routeObj.id} >



               <MapView.Polyline
                 coordinates={routeObj.convCoords}

                   strokeColor='green'
                   strokeWidth= {10}
                  //  identifier={routeID}
                  //  target={routeObj.id}
                  //  onPress={goToChooseYourOpponent}
                 />

                <MapView.Marker
                  coordinate={{ latitude: routeObj.convCoords[0].latitude, longitude: routeObj.convCoords[0].longitude}}
                  pinColor='red'
                  title='Start'
                  identifier={routeID}
                  onSelect={goToChooseYourOpponent}
                />
                <MapView.Marker
                  coordinate={{latitude: routeObj.convCoords[routeObj.convCoords.length-1].latitude, longitude: routeObj.convCoords[routeObj.convCoords.length-1].longitude}}
                  pinColor='blue'
                  title='End'
                  identifier={routeID}
                  onSelect={goToChooseYourOpponent}
                />
              </View>
            )
          })}

       	 </MapView>

      	</View>

      </View>
    )
  }
}


const mapDispatchToProps = {fetchNearbyRoutes, fetchSelectedRoute}

function mapStateToProps(state){
  return {
    nearbyRoutes: state.nearbyRoutes,
    selectedRoute: state.selectedRoute,
  }
}


var ConnectedRun = connect(mapStateToProps, mapDispatchToProps)(Run)


export default ConnectedRun





///////*}// description={routeObj.routetimes.map(routetime=>{
//   return routetime.user.username+', time: '+routetime.timesArr[routetime.timesArr.length-1];
// }).join(', ')}
