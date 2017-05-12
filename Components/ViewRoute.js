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
import {runDataCoords, runDataTimes} from './RunData'
import {numToRGBConverter} from './Utils'


class ViewRoute extends Component {
	constructor(props) {
		super(props);
    this.state ={
    view: 'lineHeatmap'
  }

    this.submitRoute = this.submitRoute.bind(this)
    this.changeViewButton = this.changeViewButton.bind(this)

	}

  changeViewButton(){
  if (this.state.view === 'lineHeatmap'){
    return this.setState({
      view: 'markerTimes'
    })
  } else if (this.state.view === 'markerTimes'){
    return this.setState({
      view: 'lineHeatmap'
    })
  }
}

  componentDidMount() {
    console.log('givenprops ', this.props.navigation.state.params )
    let phantomRacerRouteTimeId = this.props.navigation.state.params.phantomRacerRouteTimeId
    if (phantomRacerRouteTimeId){
      this.props.fetchSelectedRacer(phantomRacerRouteTimeId)
    }
  }


  submitRoute(){

    let {checkpointTimeMarker, personalCoords, personalTimeMarker, userId, startTime, endTime, phantomRacerRouteTimeId, routeId } = this.props.navigation.state.params
    console.log('startTime is ', startTime)
    this.props.addNewRoute(checkpointTimeMarker, personalCoords, personalTimeMarker, userId, startTime, endTime, routeId, phantomRacerRouteTimeId)
    const { navigate } = this.props.navigation;
    navigate('OurApp')
  }

  // replayRoute(){
  //     let selectedRoutePointer= this.state.selectedRoutePointer
  //     let selectedRacer= this.props.selectedRacer
  //     let racerCoordsPointer= this.state.racerCoordsPointer
  //     let racerTimesArrPointer= this.state.racerTimesArrPointer
  //     let phantomRacerTimeToCheck= selectedRacer.routetimes[0].timesArr[racerTimesArrPointer]
  //     let phantomRacerCurrPos= this.props.selectedRoute.convCoords[racerCoordsPointer]

  //     if(this.state.timer > phantomRacerTimeToCheck-200 && this.state.timer < phantomRacerTimeToCheck+200){
  //       this.setState({racerCoordsPointer: racerCoordsPointer+1, racerTimesArrPointer: racerTimesArrPointer+1});
  //     }
  // }

  render() {


    let givenprops = this.props.navigation.state.params
    let personalCoords = givenprops.personalCoords.slice(0)
    // console.log('this is given props', givenprops)
    let startPosition = givenprops.personalCoords[0] //This is setting the view of map to the start of the route
    // console.log('givenprops is ', givenprops)
    let finalTime = givenprops.personalTimeMarker[givenprops.personalTimeMarker.length-1]
    let totalDistance = (geolib.getPathLength(givenprops.personalCoords) * 0.000621371).toFixed(2)//the .000 whatvs is to convert meters to miles (to fixed is making it go to 2 decimal points)

    // console.log('this is the total distance', totalDistance)
    let oldRoute = givenprops.oldRoute //this will determine if the submit button is available

    //console.log('this is the total distance', totalDistance)

    // I THREW THESE IN TO POSSIBLY HELP SET THE BOUNDS OF THE MAP BASED ON THE ROUTE'S COORDINATES, SO THE ENTIRE ROUTE WOULD BE IN VIEW BY DEFAULT
    let nBound = startPosition.latitude
    let sBound = startPosition.latitude
    let eBound = startPosition.longitude
    let wBound = startPosition.longitude

    console.log("GIVEN PROPS", givenprops)

    let routeCoordsArr = givenprops.personalCoords.map((coords, idx) => { //NEED TO FEED THE ACUTAL COORDS THROUGH THIS MAP LATER ON
      nBound = Math.max(nBound, coords.latitude)
      sBound = Math.min(sBound, coords.latitude)
      eBound = Math.min(eBound, coords.longitude)
      wBound = Math.max(wBound, coords.longitude)
      return {...coords, time: givenprops.personalTimeMarker[idx]}
    })


    // console.log("THIS PROPS IS", this.props.navigation.state.params.completeRouteCoords)
    // let routeCoordsArr = this.props.navigation.state.params.completeRouteCoords
    // let routeCoordsArr = this.state.selectedRoute.convCoords // do we even need this?

    // console.log('this is what we receive', this.props.navigation.state.params, this.props.selectedRacer)

    return (
      <View>
         <View style={styles.mapcontainer}>
            <View style={styles.finalTime}>
                    {/* <Text>Final Time: {TimeFormatter(finalTime)}</Text> */}
                  </View>
            { ////////// I NEED TO FIX THIS- THIS NEW BUTTON IS COVERING UP THE OLD ONE
              this.state.view === 'lineHeatmap' ?
                <View style={styles.viewRoute}>
                      <TouchableOpacity onPress={this.changeViewButton}>
                        <Text>View Speed</Text>
                      </TouchableOpacity>
                  </View> :
                  <View style={styles.viewRoute}>
                      <TouchableOpacity onPress={this.changeViewButton}>
                        <Text>View Heatmap</Text>
                      </TouchableOpacity>
                  </View>
            }



           <View style={styles.finalDistance}>
                    <Text>Final Time: {TimeFormatter(finalTime)}</Text>
                    <Text>Final Distance: {totalDistance} Miles</Text>
          </View>

         <MapView
              region={{latitude: startPosition.latitude, longitude: startPosition.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005}}
            style={styles.map}>

            { this.state.view === 'markerTimes' &&
              routeCoordsArr.map((coords, idx) =>{
                let speed = 0


                idx > 0 ? speed = geolib.getSpeed(routeCoordsArr[idx-1], coords, {unit: 'mph'}) : speed = 0
                console.log("SPEED", speed)
                let speedColor = numToRGBConverter(speed,22, 100, 220, false)
                return (
                  <MapView.Marker
                    key={idx}
                    coordinate={coords}
                    pinColor={speedColor}
                    title={''+speed + ' mph'}
                    style={{height: 10, width: 10, backgroundColor: speedColor, borderRadius: 10}}
                  >
                  </MapView.Marker>
                )
              })
            }
            {
              (this.state.view === 'lineHeatmap' &&
              ////////SWITCH TO THIS FOR POLYLINE

              personalCoords.length) && personalCoords.map((coords, idx) => {
                let speed = 0
                speed = (idx > 0) ? geolib.getSpeed(routeCoordsArr[idx-1], routeCoordsArr[idx], {unit: 'mph'}) : 0
                console.log('routecoordsarr ',routeCoordsArr)
                console.log("SPEED", speed)
                let speedColor = numToRGBConverter(speed,22, 5, 13, true)
                // console.log("SPEEDCOLOR", speedColor)

                let firstCoord = personalCoords[idx - 1] || coords
                console.log("Firstcoords, ", firstCoord, 'coords ',coords)

                return (
                  <View>

                  <MapView.Polyline
                    key={idx}
                    // coordinates={[runDataCoords[idx-1], coords]}
                    coordinates={[firstCoord, coords]}
                    strokeColor={speedColor}
                    // strokeColor={'red'}
                    strokeWidth={10}
                    // title={''+speed}
                  />
                  </View>
                )
              })
            }







            {/* <MapView.Polyline coordinates={givenprops.personalCoords} strokeColor='green' strokeWidth= {4} /> */}

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

////Couldnt get this to display the speed in a callout bubble
// const CustomMarker = ({color}) => (
//   <View style={{height: 10, width: 10, backgroundColor: color, borderRadius: 10}}></View>
// )

const mapDispatchToProps = {addNewRoute, fetchSelectedRacer}

function mapStateToProps(state){
  return {
    user: state.user,
    selectedRacer: state.selectedRacer,
    selectedRoute: state.selectedRoute
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewRoute)
