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
import {addNewRoute, fetchSelectedRacer} from './storeAndReducer'


class ViewRoute extends Component {
	constructor(props) {
		super(props);

    this.submitRoute = this.submitRoute.bind(this)

	}

  componentDidMount() {
    console.log('givenprops ', this.props.navigation.state.params )
    let opponentRoutetimeId = this.props.navigation.state.params.opponentRoutetimeId
    // let opponentRoutetimeId = 1 //this is for testing... need to update heroku to have our real backend
    if (opponentRoutetimeId){
      // console.log('opppooonnnneeennnt')
      this.props.fetchSelectedRacer(opponentRoutetimeId)
    }
  }


  submitRoute(){
    let {checkpointTimeMarker, timeMarker, routeCoords, userId, startTime, endTime} = this.props.navigation.state.params
    this.props.addNewRoute(checkpointTimeMarker, timeMarker, routeCoords, userId, startTime, endTime)
    const { navigate } = this.props.navigation;
    navigate('OurApp')
  }


  replayRoute(){

      let selectedRoutePointer= this.state.selectedRoutePointer
      let selectedRacer= this.props.selectedRacer
      let racerCoordsPointer= this.state.racerCoordsPointer
      let racerTimesArrPointer= this.state.racerTimesArrPointer
      let phantomRacerTimeToCheck= selectedRacer.routetimes[0].timesArr[racerTimesArrPointer]
      let phantomRacerCurrPos= this.props.selectedRoute.convCoords[racerCoordsPointer]

      if(this.state.timer > phantomRacerTimeToCheck-200 && this.state.timer < phantomRacerTimeToCheck+200){
        this.setState({racerCoordsPointer: racerCoordsPointer+1, racerTimesArrPointer: racerTimesArrPointer+1});
      }

  }

  render() {

    let givenprops = this.props.navigation.state.params
    let startPosition = givenprops.convCoords[0] //This is setting the view of map to the start of the route
    console.log('givenprops is ', givenprops)
    let finalTime = givenprops.timesArr[givenprops.timesArr.length-1]
    let totalDistance = (geolib.getPathLength(givenprops.convCoords) * 0.000621371).toFixed(2)//the .000 whatvs is to convert meters to miles (to fixed is making it go to 2 decimal points)

    // console.log('this is the total distance', totalDistance)
    let oldRoute = givenprops.oldRoute //this will determine if the submit button is available

    //console.log('this is the total distance', totalDistance)

    // console.log("THIS PROPS IS", this.props.navigation.state.params.completeRouteCoords)
    let routeCoordsArr = this.props.navigation.state.params.completeRouteCoords

    console.log('this is what we receive', this.props.navigation.state.params, this.props.selectedRacer)

    return (
      <View>
         <View style={styles.mapcontainer}>
            <View style={styles.finalTime}>
                    <Text>Final Time: {TimeFormatter(finalTime)}</Text>
          </View>
           <View style={styles.finalDistance}>
                    <Text>Final Distance: {totalDistance} Miles</Text>
          </View>

         <MapView
              region={{latitude: startPosition.latitude, longitude: startPosition.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005}}
            style={styles.map}>

            <MapView.Polyline coordinates={givenprops.convCoords} strokeColor='green' strokeWidth= {4} />

          </MapView>
          {!oldRoute &&
            <View style={styles.submitRoute}>
                <TouchableOpacity onPress={this.submitRoute}>
                  <Text>Submit Run</Text>
               </TouchableOpacity>
            </View> }

            <View style={styles.replayRoute}>
                <TouchableOpacity onPress={this.replayRoute}>
                  <Text>Replay Run</Text>
               </TouchableOpacity>
            </View>
          </View>
        </View>
    )
  }
}

const mapDispatchToProps = {addNewRoute, fetchSelectedRacer}

function mapStateToProps(state){
  return {
    user: state.user,
    selectedRacer: state.selectedRacer
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewRoute)
