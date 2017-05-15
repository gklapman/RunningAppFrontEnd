//REACT MODULES
import React, { Component } from 'react'
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
import {StackNavigator} from 'react-navigation'
import MapView from 'react-native-maps'
import {connect} from 'react-redux'
import BackgroundGeolocation from "react-native-background-geolocation"
//CUSTOM MODULES
import styles from '../Styles'
import {fetchNearbyRoutes, fetchSelectedRoute} from './storeAndReducer'
import RunARoute from './RunARoute';
import {Btn, BtnHolder} from './Wrappers'
import {redish, blueish, beige} from './Constants'
import { IntersectADJLIST } from './utils/genRoute'


class Run extends Component {
  constructor(){
    super();
    this.state= {
      initialRegionSet: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      intersectionMarkers: [],
      querycoords: [],
  }
    this.canMakeRequests= false
    this.scrollWaitInterval
    this.onRegionChange=this.onRegionChange.bind(this)
    this.genRoute= this.genRoute.bind(this)
  }

  genRoute(){
    // console.log('genRoute button clicked')
    let region = this.state.region
    console.log('region ', region)
    let intAdjList= new IntersectADJLIST(region)

    // intAdjList.intersectQueryBulk({latitude: region.latitude, longitude: region.longitude})
    //   .then(res=>{
    //     console.log('intersectionsArr in genRoute ', res)
    //     let intersectionsArr= res
    //     let intersectionMarkers= this.state.intersectionMarkers.slice(0)
    //     intersectionMarkers= intersectionMarkers.concat(intersectionsArr)
    //     console.log('intersectionMarkers ', intersectionMarkers)
    //     this.setState({intersectionMarkers: intersectionMarkers})
    //   })
    //   .catch(err=>console.error(err))

    intAdjList.intersectsPerRegion()
      .then(res=>{
        if(res==='error') throw res
        // console.log('intersectionsArr in genRoute ', res)
        let intersectionsArr= res.intersections
        let querycoords = res.querycoords
        let intersectionMarkers= this.state.intersectionMarkers.slice(0)
        intersectionMarkers= intersectionMarkers.concat(intersectionsArr)
        // console.log('intersectionMarkers ', intersectionMarkers)
        this.setState({intersectionMarkers, querycoords})
      })
      .catch(err=>console.error(err))
  }

  onLocation(){
    //do nothing... we just want a listener so the thing woulD STOP FUCKING TELLING US IT'S SENDING LOCAITON WITH NO LISTENERS!!!
  }

  componentWillMount(){
    this.setState()
    BackgroundGeolocation.on('location', this.onLocation)
  }

  componentWillUnmount(){
    BackgroundGeolocation.un('location', this.onLocation)
  }

  onRegionChange(region) {
    //SOMETHING IS CHANGING THE FUCKING REGION FROM THE INITIAL ONE... I DONT KNOW WHAT THE FUCK IT IS BUT YOU NEED TO FUCKING FIND OUT
    //AND FUCKING *** DESTROY *** THAT FUCKING PIECE OF SHIT CODE THAT IS FUCKING THIS SHIT UP

    //for onRegionChange... to prevent too many axios requests being made as a user is scrolling...  this is NOT part of state, and will NOT be changed via setState, because setting state may be too slow
    this.canMakeRequests=true;
    clearInterval(this.scrollWaitInterval);//this clears the LAST interval set
    this.scrollWaitInterval=setInterval(() => {//this now sets a new interval
      if(this.props && this.canMakeRequests){
        this.props.fetchNearbyRoutes(region)//this thunk will run AFTER .5 seconds, assuming the interval was not cleared by then (clears if user keeps scrolling), AND this.canMakeRequests is set to true
          .then(()=>this.setState({region}))
          .catch(err=>console.error(err))
      }
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
      let routeID = evt
      // console.log('this is the id ',routeID)
      this.props.fetchSelectedRoute(routeID)
      navigate('ChooseYourOpponent')
    }

    const filter = () => {
    	// console.log('this will be for filters')
    }

    let intersectionMarkers= this.state.intersectionMarkers
    let querycoords= this.state.querycoords
    console.log('this.state ',this.state)

    return (
      <View>

        <View style={styles.mapcontainer}>


        <View style={styles.btnHolder}>
          <Btn>
            <Text onPress={goToRouteMaker}>Create a Route</Text>
          </Btn>
       	 	<Btn>
            <Text onPress={filter}>Filter Routes</Text>
       	 	</Btn>
        </View>

        {/* <Btn>
          <Text onPress={goToRouteMaker}>Create a Route</Text>
        </Btn>

        <View style={{...styles.filter, }} >
          <Text onPress={filter}>Filter Routes</Text>
        </View> */}


          <View style={styles.genRoute}>
       	 		<Button onPress={this.genRoute} title="Generate Route"></Button>
       	 	</View>

       	 	<MapView style={styles.map}
            onRegionChange={this.onRegionChange}
            initialRegion={{latitude: 41.88782633760493, longitude: -87.64045111093955, latitudeDelta: .005, longitudeDelta: .005}}>


          {querycoords.map(coord=>{
            return(<MapView.Marker
              coordinate={{ latitude: coord.latitude, longitude: coord.longitude}}
              // coordinate={{ latitude: 41.88782633760493, longitude: -87.64045111093955}}
              pinColor='red'
              title='querycoord'
            />)
          })}

          {intersectionMarkers.map(intersection=>{
            return(<MapView.Marker
              coordinate={{ latitude: intersection.latitude, longitude: intersection.longitude}}
              // coordinate={{ latitude: 41.88782633760493, longitude: -87.64045111093955}}
              pinColor='black'
              title='intersection'
            />)
          })}

          {routesArr.map(routeObj=>{
            let routeID = ""+routeObj.id;
            let colorsArr = ['#610', '#134', '#D90', 'black']
            let routeColor = colorsArr[routeObj.id % 4]
            return(
              <View key={routeObj.id} >



               <MapView.Polyline
                 coordinates={routeObj.convCoords}

                   strokeColor={routeColor}
                   strokeWidth= {10}
                   onPress={goToChooseYourOpponent.bind(this, routeObj.id)}
                 />

                <MapView.Marker
                  coordinate={{ latitude: routeObj.convCoords[0].latitude, longitude: routeObj.convCoords[0].longitude}}
                  pinColor={routeColor}
                  title='Start'
                  // identifier={routeID}
                  // onSelect={goToChooseYourOpponent}
                />
                <MapView.Marker
                  coordinate={{latitude: routeObj.convCoords[routeObj.convCoords.length-1].latitude, longitude: routeObj.convCoords[routeObj.convCoords.length-1].longitude}}
                  pinColor={routeColor}
                  title='End'
                  // identifier={routeID}
                  // onSelect={goToChooseYourOpponent}
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
