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
//CUSTOM MODULES
import styles from '../Styles'
import {fetchNearbyRoutes, fetchSelectedRoute} from './storeAndReducer'
import RunARoute from './RunARoute';

class Run extends Component {
  constructor(){
    super();
    this.canMakeRequests= false;
    this.scrollWaitInterval;
    this.onRegionChange=this.onRegionChange.bind(this);
  }

  onLocation(){
    //do nothing... we just want a listener so the thing woulD STOP FUCKING TELLING US IT'S SENDING LOCAITON WITH NO LISTENERS!!!
  }

  componentWillMount(){
    BackgroundGeolocation.on('location', this.onLocation)
  }

  componentWillUnmount(){
    BackgroundGeolocation.un('location', this.onLocation)
  }

  onRegionChange(region) {
    //for onRegionChange... to prevent too many axios requests being made as a user is scrolling...  this is NOT part of state, and will NOT be changed via setState, because setting state may be too slow
    this.canMakeRequests=true;
    clearInterval(this.scrollWaitInterval);//this clears the LAST interval set
    this.scrollWaitInterval=setInterval(() => {//this now sets a new interval
      if(this.props && this.canMakeRequests) this.props.fetchNearbyRoutes(region);//this thunk will run AFTER .5 seconds, assuming the interval was not cleared by then (clears if user keeps scrolling), AND this.canMakeRequests is set to true
      this.canMakeRequests= false;//set to false so that the axios request does not keep happening after the scrolling has stopped and fetchNearbyRoutes has already run once
    },500)
  }

  render() {
  	const { navigate } = this.props.navigation;
    const gotoRouteSelect = () => Actions.routeSelectPage({text: 'this goes to route select page!'});
    let routesArr = this.props.nearbyRoutes;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
      })

    const goToRouteMaker = () => {
    	navigate('MakeRoute')
   	}

    const goToChooseYourOpponent = (evt) => {
      const routeID = ''+evt.nativeEvent.id
      this.props.fetchSelectedRoute(routeID)
      console.log('this is the route id', routeID)
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
