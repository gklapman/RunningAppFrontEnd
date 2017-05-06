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


class ViewRoute extends Component {
	constructor(props) {
		super(props);
		
    this.submitRoute = this.submitRoute.bind(this)
    
	}


    submitRoute(){
          let {convCoords, userId, timesArr, startTime, endTime} = this.props.navigation.state.params
        console.log('this is the info', convCoords, timesArr)
          this.props.addNewRoute(convCoords, userId, timesArr, startTime, endTime)
          const { navigate } = this.props.navigation;
          navigate('OurApp')
      }


  render() {

    let givenprops = this.props.navigation.state.params
    let finalTime = givenprops.timesArr[givenprops.timesArr.length-1]
    let totalDistance = (geolib.getPathLength(givenprops.convCoords) * 0.000621371).toFixed(2)
    console.log('this is the total distance', totalDistance)

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
              region={{latitude: givenprops.currentPosition.latitude, longitude: givenprops.currentPosition.longitude, latitudeDelta: .01, longitudeDelta: .01}}
            style={styles.map}>

            <MapView.Polyline coordinates={givenprops.convCoords} strokeColor='green' strokeWidth= {4} />

          </MapView>

          <View style={styles.viewRoute}>
                  <TouchableOpacity onPress={this.submitRoute}>
                    <Text>Submit Run</Text>
                  </TouchableOpacity>
          </View> 
          </View>
        </View>
    )
  }
}

const mapDispatchToProps = {addNewRoute}

function mapStateToProps(state){
  return {
    // currentUser: state.currentUser,
    // currentLocation: state.currentLocation
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewRoute)


