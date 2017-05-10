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

//CUSTOM MODULES
import styles from '../Styles'
import {addNewRoute} from './storeAndReducer'
import {promisifiedGetCurrPos} from './Utils'


class MakeRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPosition: {latitude: 0, longitude: 0} , //THIS WILL BE TAKEN FROM THE STORE TO RENDER INITIAL RUNNER STATE
			isRunning: false,
			timer: 0,
			timerStart: 0,
			timerEnd: 0,
			routeCoords: [],
			timeMarker: [0]
		}
		this.startStopButton = this.startStopButton.bind(this)
    this.viewRoute = this.viewRoute.bind(this)
    this.onLocation = this.onLocation.bind(this)
	}

  onLocation(locInp){
    console.log('onLoc listeners invoked (make sure this is NOT being run when outside components like makeroute and runaroute that need to watch location!)')
    let lng = locInp.coords.longitude
    let lat = locInp.coords.latitude

    axios.get(`https://roads.googleapis.com/v1/snapToRoads?path=${lat},%20${lng}&key=AIzaSyBlN-sYTlKuxuCHeOgX0wvj_L-iOxaLvwM`)
    // axios.get('https://roads.googleapis.com/v1/snapToRoads?path=41.860494,%20-87.617480&key=AIzaSyBlN-sYTlKuxuCHeOgX0wvj_L-iOxaLvwM')
      .then(res=>{
        console.log(res.data.snappedPoints[0].location)
        let snappedLoc= res.data.snappedPoints[0].location
        let newPosition = {latitude: snappedLoc.latitude, longitude: snappedLoc.longitude }
        this.setState({ currentPosition: newPosition })

        if(this.state.isRunning){
          let elapsedTime= Date.now() - this.state.timerStart
          this.setState({
            timer: elapsedTime
          })

          let newrouteCoords = this.state.routeCoords.slice(0)//not sure if this is necessary anymore... investigate when we have time
          newrouteCoords.push(newPosition)

          let timeMarkerArr = this.state.timeMarker
          timeMarkerArr.push(elapsedTime)

          this.setState({
            routeCoords: newrouteCoords,
            timeMarker: timeMarkerArr
          })
        }
      })
      .catch(err=>console.log(err))
  }

  componentWillMount() {
    promisifiedGetCurrPos()//BackgroundGeolocation is still far superior to navigator.geolocation.getCurrentPosition, but the latter is still good to use for getting position at a specified time
      .then((position) => {
        console.log('here')
        let lng = position.coords.longitude
        let lat = position.coords.latitude
        let newPosition = {latitude: lat, longitude: lng}
        return this.setState({//not actually sure if this will actually wait for setState to complete before adding the BackgroundGeolocation onlocation listener.. we can put in the setState callback function later, if this causes problems
          currentPosition: newPosition
        })
      })
      .then(()=>{
        BackgroundGeolocation.on('location', this.onLocation)
    })
  }

  componentWillUnmount(){
    BackgroundGeolocation.un('location', this.onLocation)//needed to remove listener when component unmounts
    this.setState({//this is needed to set things back to default.
      currentPosition: {latitude: 0, longitude: 0} ,
      isRunning: false,
      timer: 0,
      timerStart: 0,
      timerEnd: 0,
      routeCoords: [],
      timeMarker: [0]
    })
  }

  startStopButton() {
    //when we have time, we can reimplement a timer that can run in realtime when the app is in the foreground (PURELY for visual effect... not for determining whether to push points or anything)
    //essentially we'll have part of our old code (before background geolocation implementation) still running when the app is in the foreground
    	if(this.state.isRunning){
    		// clearInterval(this.interval)   //leavning this in case we do decide to do the above.. just as reminder
    		this.setState({
    			isRunning: false,
          timerEnd: Date.now()
    		})
    		return;
    	} else {
        let lat = this.state.currentPosition.latitude
        let lng = this.state.currentPosition.longitude
        let firstRouteCoord = [{latitude: lat, longitude: lng}]
	    		this.setState({
	    		isRunning: true,
	    		timerStart: Date.now(),
	    		routeCoords: firstRouteCoord
    		})
    }
  }

  viewRoute(){
      let convCoords = this.state.routeCoords;
      let userId = this.props.user.id;
      let timesArr = this.state.timeMarker
      let startTime = this.state.timerStart
      let endTime = this.state.timerEnd
      let currentPosition = this.state.currentPosition

      const { navigate } = this.props.navigation;
      navigate('ViewRoute', {convCoords, userId, timesArr, startTime, endTime, currentPosition})

  }


  render() {

    const position = this.state.currentPosition;
  	const routerDisplayCoords = this.state.routeCoords.slice(0)


    // console.log('this is the info ', this.state.isRunning, this.state.timerEnd)
    return (
      <View>
      	<View style={styles.mapcontainer}>
        {!this.state.isRunning && this.state.timerEnd !== 0 ?
          <View style={styles.viewRoute}>
                <TouchableOpacity onPress={this.viewRoute}>
                  <Text>View Run</Text>
                </TouchableOpacity>
            </View> :
            <View style={styles.startStop}>
              <TouchableOpacity onPress={this.startStopButton}>
                <Text>{this.state.isRunning ? 'Stop' : 'Start'}</Text>
              </TouchableOpacity>
           </View> }

      		<View style={styles.timer}>
      			<Text>{TimeFormatter(this.state.timer)}</Text>

      			<Text>{this.state.currentPosition.latitude}</Text>
      			<Text>{this.state.currentPosition.longitude}</Text>

      		</View>
       	 	<MapView
       	 		region={{latitude: position.latitude, longitude: position.longitude, latitudeDelta: .0005, longitudeDelta: .0005}}
			    style={styles.map}>

       {routerDisplayCoords.map((coord, idx) =>{
         let coord1=coord;
         let coord2={latitude:coord.latitude, longitude:coord.longitude+.001}
         let coord3={latitude:coord.latitude+.001, longitude:coord.longitude}
        //  let stringified = JSON.stringify(coord1)
        //  let easy2readCoords = stringified.slice()
        //  return(<MapView.Polygon coordinates={[coord1,coord2,coord3]} strokewidth={5}/>)
         return(<MapView.Marker coordinate={coord1} title={JSON.stringify(coord1)} key={''+idx}/>)
       })}

       {/* <MapView.Marker
         coordinate={{latitude: routeObj.convCoords[routeObj.convCoords.length-1].latitude, longitude: routeObj.convCoords[routeObj.convCoords.length-1].longitude}}
         pinColor='blue'
         title='End'
         identifier={routeID}
         onSelect={goToRaceView}
       /> */}

			 <MapView.Polyline coordinates={routerDisplayCoords} strokeColor='green' strokeWidth= {10} />

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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MakeRoute)
