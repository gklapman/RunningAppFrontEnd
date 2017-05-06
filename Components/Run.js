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

//added for react-redux
import {connect} from 'react-redux'
import {fetchNearbyRoutes} from './storeAndReducer'


class Run extends Component {
  // constructor(){
  //   super();
  //   this.state = Object.assign({}, this.props)
  // }

  componentWillMount(){
    // console.log("will this work?")
    this.props.fetchNearbyRoutes();
  }

  render() {


  	const { navigate } = this.props.navigation;

    const gotoRouteSelect = () => Actions.routeSelectPage({text: 'this goes to route select page!'});

    //
    // const testRoutesArr=//dummy data... delete this once we are able to get routes from props (and from backend)
    // [
    //   {
    //     id: 1,
    //     coords: [{latitude: 37, longitude: -122},{latitude: 36.5, longitude: -121},{latitude: 36.25, longitude: -119.5}],//this is routes array
    //     routetimes: [
    //       {timesArr: [0,7,16,24], user: {username: 'Alyssa'}},//these are times arrays associated with routes, and the times arrays also have their associated user
    //       {timesArr: [0,8,16,25], user: {username: 'Gabi'}},
    //       {timesArr: [0,5,10,19], user: {username: 'Charles'}}
    //     ],
    //   },
    //   {
    //     id: 2,
    //     coords: [{latitude: 35, longitude: -118},{latitude: 35.75, longitude: -119.75},{latitude: 35.5, longitude: -119.5}],//this is routes array
    //     routetimes: [
    //       {timesArr: [0,7,16,24], user: {username: 'Alyssa'}},
    //       {timesArr: [0,8,16,25], user: {username: 'Gabi'}},
    //       {timesArr: [0,5,10,19], user: {username: 'Charles'}}
    //       ],
    //   }
    // ]

    // const routesArr= testRoutesArr;
    let routesArr = this.props.nearbyRoutes;

    console.log("THIS PROPS NB ROUTES", this.props.nearbyRoutes)

    // const routesArr= navigation.state.params.routesArr; //uncomment this once we are able to get the routes from props

    // const polyLineArr=[{latitude: 37, longitude: -122},{latitude: 36, longitude: -119}];  //example of something you can pass into Polyline as coordinates (as props)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
      })

    const goToRouteMaker = () => {
    	navigate('MakeRoute')
   	}

    const filter = () => {
    	console.log('this will be for filters')
    }

    return (
      <View>

        <View style={styles.mapcontainer}>

        	<View style={styles.createRoute}>
       	 		<Button onPress={goToRouteMaker} title="Create a Route"></Button>
       	 		</View>
       	 		<View style={styles.filter}>
       	 		<Button onPress={filter} title="Filter Your Routes"></Button>
       	 		</View>


       	 	<MapView style={styles.map}>

          {routesArr.map(routeObj=>{
            //routeObj looks like { id: 1, coords: [[37, -122],[3,4],[5,6]] }



            return(


              <View key={routeObj.id} >

               <MapView.Polyline
                 coordinates={


                   routeObj.coords.map(function(coordPair){
                     return {latitude: coordPair[0], longitude: coordPair[1]}
                    })
                   }
                   strokeColor='green'
                   strokeWidth= {2}
                 />

                <MapView.Marker
                  coordinate={{ latitude: routeObj.coords[0][0], longitude: routeObj.coords[0][1]}}
                  pinColor='red'
                  title='Start'

                />
                <MapView.Marker
                  coordinate={{latitude: routeObj.coords[routeObj.coords.length-1][0], longitude: routeObj.coords[routeObj.coords.length-1][1]}}
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

const mapDispatchToProps = {fetchNearbyRoutes}

function mapStateToProps(state){
  return {
    nearbyRoutes: state.nearbyRoutes
  }
}


var ConnectedRun = connect(mapStateToProps, mapDispatchToProps)(Run)


export default ConnectedRun





///////*}// description={routeObj.routetimes.map(routetime=>{
//   return routetime.user.username+', time: '+routetime.timesArr[routetime.timesArr.length-1];
// }).join(', ')}
