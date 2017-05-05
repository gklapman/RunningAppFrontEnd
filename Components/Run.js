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
import OurMap from './OurMap'
import MapView from 'react-native-maps';

//added for react-redux
import {connect} from 'react-redux'
import {fetchRunnerCoords} from './storeAndReducer'


class Run extends Component {

  addRunnerCoords(evt){
    console.log("EVT ON MAP", evt)
    var coords = Math.floor(Math.random * 100)
    this.props.fetchRunnerCoords(coords)
  }

  render() {

    console.log("this.state is", this.state)
    console.log("this.props is", this.props)

    const gotoRouteSelect = () => Actions.routeSelectPage({text: 'this goes to route select page!'});


    const testRoutesArr=//dummy data... delete this once we are able to get routes from props (and from backend)
    [
      {
        id: 1,
        coords: [{latitude: 37, longitude: -122},{latitude: 36.5, longitude: -121},{latitude: 36.25, longitude: -119.5}],//this is routes array
        routetimes: [
          {timesArr: [0,7,16,24], user: {username: 'Alyssa'}},//these are times arrays associated with routes, and the times arrays also have their associated user
          {timesArr: [0,8,16,25], user: {username: 'Gabi'}},
          {timesArr: [0,5,10,19], user: {username: 'Charles'}}
        ],
      },
      {
        id: 2,
        coords: [{latitude: 35, longitude: -118},{latitude: 35.75, longitude: -119.75},{latitude: 35.5, longitude: -119.5}],//this is routes array
        routetimes: [
          {timesArr: [0,7,16,24], user: {username: 'Alyssa'}},
          {timesArr: [0,8,16,25], user: {username: 'Gabi'}},
          {timesArr: [0,5,10,19], user: {username: 'Charles'}}
          ],
      }
    ]

    const routesArr= testRoutesArr;
    // const routesArr= navigation.state.params.routesArr; //uncomment this once we are able to get the routes from props

    // const polyLineArr=[{latitude: 37, longitude: -122},{latitude: 36, longitude: -119}];  //example of something you can pass into Polyline as coordinates (as props)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        console.log('this is the initial', initialPosition)
      }
      )

    return (
      <View>

        <View style={styles.mapcontainer}>
       	 	<MapView style={styles.map}>

          {routesArr.map(routeObj=>{
            return(
              <View key={routeObj.id}>
                <MapView.Polyline coordinates={routeObj.coords} strokeColor='green' strokeWidth= {2} />

                <MapView.Marker
                  coordinate={routeObj.coords[0]}
                  pinColor='red'
                  title='Start'
                  description={routeObj.routetimes.map(routetime=>{
                    return routetime.user.username+', time: '+routetime.timesArr[routetime.timesArr.length-1];
                  }).join(', ')}
                />
                <MapView.Marker
                  coordinate={routeObj.coords[routeObj.coords.length-1]}
                  pinColor='blue'
                  title='End'
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

const mapDispatchToProps = {fetchRunnerCoords}

function mapStateToProps(state){
  return {
    runnerCoords: state.runnerCoords
  }
}

var ConnectedRun = connect(mapStateToProps, mapDispatchToProps)(Run)

export default ConnectedRun
