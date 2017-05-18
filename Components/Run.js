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
import {Btn, BtnHolder, BtnHolderVert, BtnRun} from './Wrappers'
import {redish, blueish, beige, yellowish} from './Constants'
import { IntersectADJLIST, GenerateRoutes } from './utils/genRoute'
//CUSTOM IMAGES
import intersectImgMajor from '../assets/IntersectionMajor.png'
import intersectImgMinor from '../assets/IntersectionMinor.png'


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
      streetLookup: {},
      adjList: {},
      generatedRoutes: [],
      genRouteNum: 0,

      routesArr: [],
      showFilter: false,

      status: null,

      startCoord: null,
      endCoord: null,
      setStartEndVal: null,

  }
    this.canMakeRequests= false
    this.scrollWaitInterval
    this.onRegionChange=this.onRegionChange.bind(this)
    this.genRoute= this.genRoute.bind(this)
    this.incrementRouteNum= this.incrementRouteNum.bind(this)
    this.handleMinChange = this.handleMinChange.bind(this)
    this.handleMaxChange = this.handleMaxChange.bind(this)
    // this.showFilter = this.showFilter.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.setStartEnd= this.setStartEnd.bind(this)
    this.setClickCoordinate= this.setClickCoordinate.bind(this)

  }

  incrementRouteNum(){
    let newgenRouteNum=this.state.genRouteNum+1
    this.setState({genRouteNum: newgenRouteNum})
  }

  genRoute(startCoord, endCoord){//startCoord and endCoord are optional

    this.setStartEnd()

    let region = this.state.region
    let startIntersect
    let endIntersect

    let intAdjList= new IntersectADJLIST(region)
    this.setState({status: 'Constructing City Layout'})

    intAdjList.intersectsPerRegion()
      .then(res=>{
        if(res==='error') throw res

        this.setState({status: 'Generating Route'})
        // let intersectionsArr= res.intersections
        let querycoords = res.querycoords
        // let intersectionMarkers= this.state.intersectionMarkers.slice(0)
        // intersectionMarkers= intersectionMarkers.concat(intersectionsArr)//When you can, start transitioning to getting this directly from the instance
        intAdjList.sortStreetLookup()
        intAdjList.connectIntersectNodes()
        intAdjList.sortConnections()
        let intersectionMarkers=Object.keys(intAdjList.adjList).map(key=>intAdjList.adjList[key])
        let streetLookup= intAdjList.streetLookup
        let adjList= intAdjList.adjList
        // console.dir(intAdjList, {depth: 5})
        this.setState({ intersectionMarkers, querycoords, streetLookup, adjList })
        return Promise.all([intAdjList.intersectQuery({latitude: region.latitude, longitude: region.longitude}),//this is not dry at all.. doing another query in the center -_-   .. fix this later
          startCoord && intAdjList.intersectQuery({latitude: startCoord.latitude, longitude: startCoord.longitude}),
          endCoord && intAdjList.intersectQuery({latitude: endCoord.latitude, longitude: endCoord.longitude}),
        ])
      })
      .then(res=>{
        let currentCoord= res[0]
        let startingCoord= res[1]
        let endingCoord= res[2]

        let startingKey= startingCoord && startingCoord.latitude+','+startingCoord.longitude
        let endingKey= endingCoord && endingCoord.latitude+','+endingCoord.longitude
        if(intAdjList.adjList[startingKey] && intAdjList.adjList[endingKey]){
          startingNode= intAdjList.adjList[startingKey]
          endingNode= intAdjList.adjList[endingKey]
        }
        else{
          startingKey= currentCoord.latitude+','+currentCoord.longitude
          startingNode= intAdjList.adjList[startingKey]
          endingNode= startingNode
        }

        let genRoute= new GenerateRoutes(startingNode,endingNode,4800,intAdjList)
        genRoute.dijkstra(startingNode, endingNode)
        // genRoute.setRouteNodesDist()
        // genRoute.getRoutes()
        // genRoute.sortPotentialRoutes()
        // let generatedRoutes= genRoute.potentialRoutes
        // console.log('intAdjList inst updated ', intAdjList)
        // console.log('routes generated ',generatedRoutes)
        // this.setState({generatedRoutes, status: 'Finalizing'})
        return
      })
      .then(()=>{
        setTimeout(()=>{
          this.setState({status: null, intersectionMarkers: [], streetLookup: {}})
        }, 1000)
      })
      .catch(err=>console.error(err))
  }

  setStartEnd(){
    if(!this.state.setStartEndVal) {this.setState({setStartEndVal: 'start'})}
    else this.setState({setStartEndVal: null})
  }

  setClickCoordinate(e){
    let coord=e.nativeEvent.coordinate
    console.log('coord is ',coord,'startCoord is ', this.state.startCoord)
    if(this.state.setStartEndVal==='start'){
      this.setState({startCoord: coord, setStartEndVal: 'end'})
    }
    else if(this.state.setStartEndVal==='end'){
      this.setState({setStartEndVal: null})
      this.genRoute(this.state.startCoord, coord)
    }
  }

  onLocation(){
    //do nothing... we just want a listener so the thing woulD STOP FUCKING TELLING US IT'S SENDING LOCAITON WITH NO LISTENERS!!!
  }

  handleMinChange(num){
    if (!num){
      this.setState({
        routesArr: this.props.nearbyRoutes
      })
    } else {

      let routesArr = this.props.nearbyRoutes
      routesArr = routesArr.filter(route => {
        return route.totalDist > num
      })
      console.log('routesArr ', routesArr)
      this.setState({
        routesArr: routesArr
      })
    }
  }

  handleMaxChange(num){
    if (!num){
      this.setState({
        routesArr: this.props.nearbyRoutes
      })
    } else {
      let routesArr = this.props.nearbyRoutes
      routesArr =routesArr.filter(route => {
        return route.totalDist < num
      })
      this.setState({
        routesArr: routesArr
      })
    }
  }

  componentWillMount(){
    this.setState()
    BackgroundGeolocation.on('location', this.onLocation)
  }

  componentWillUnmount(){
    BackgroundGeolocation.un('location', this.onLocation)
  }

  // showFilter(){  //THIS FUNCTIONALITY SHOULD NOW BE HANDLED BY THE POP-UP
  //   if (this.state.showFilter) return
  //     // return (
  //     // <View style={styles.filterHolder}>
  //     //     <Text>Min:</Text><TextInput style={styles.filterInput} maxLength={4} keyboardType={'decimal-pad'} onChangeText={this.handleMinChange} />
  //     //     <Text>Max:</Text><TextInput style={styles.filterInput} maxLength={4} keyboardType={'decimal-pad'} onChangeText={this.handleMaxChange} />
  //     //   </View>)
  // }

  toggleFilter(){
    console.log('toggling ')
    let filter = this.state.showFilter
    this.setState({showFilter: !filter})
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
          .then(()=>{
            this.setState({
              region: region,
              routesArr: this.props.nearbyRoutes
              })
            })

          .catch(err=>console.error(err))
      }
      this.canMakeRequests= false;//set to false so that the axios request does not keep happening after the scrolling has stopped and fetchNearbyRoutes has already run once
    },500)
  }

  render() {
  	const { navigate } = this.props.navigation;
    const gotoRouteSelect = () => Actions.routeSelectPage({text: 'this goes to route select page!'});
    let routesArr = this.state.routesArr
    // console.log('routeArr ', routesArr)

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

    const consoleLogIntersection = (evt) => {
      let id= evt.nativeEvent.id
      console.log(this.state.adjList[id])
    }


    let intersectionMarkers= this.state.intersectionMarkers
    let streetLookup= this.state.streetLookup
    let querycoords= this.state.querycoords
    let generatedRoutes= this.state.generatedRoutes
    let genRouteNum= this.state.genRouteNum

    //IF THE POPUP WORKS FINE, THESE LINES AND THE BUTTON ON 295 CAN BE DELETED
    // let genRouteBtnText = this.state.setStartEndVal==='start' ? <BtnRun><Text onPress={this.setStartEnd}>Select Start</Text></BtnRun>
    // : this.state.setStartEndVal==='end' ?  <BtnRun><Text onPress={this.setStartEnd}>Select End</Text></BtnRun>
    // : null

    return (
      <View>

        <View style={styles.mapcontainer}>

        <BtnHolderVert>
          <BtnRun>
            <Text onPress={goToRouteMaker}>Create a Route</Text>
          </BtnRun>
          <BtnRun>
            <Text onPress={this.setStartEnd}>Generate Route</Text>
          </BtnRun>
          {/* {genRouteBtnText} */}
       	 	<BtnRun>
            <Text onPress={this.toggleFilter}>Filter Routes</Text>
       	 	</BtnRun>
          {/* <BtnRun><Text onPress={this.setStartEnd}>{genRouteBtnText}</Text></BtnRun> */}
        </BtnHolderVert>
      {/* {this.showFilter()} */}

        {/* <Btn>
          <Text onPress={goToRouteMaker}>Create a Route</Text>
        </Btn>

        <View style={{...styles.filter, }} >
          <Text onPress={filter}>Filter Routes</Text>
        </View> */}


          {/* <View style={styles.genRoute}>
       	 		<Button onPress={this.genRoute} title="Generate Route"></Button>
       	 	</View> */}

          {/* <View style={styles.incrementRouteNum}>
            <Button onPress={this.incrementRouteNum} title="See Next Gen Route"></Button>{/* This is a test button alyssa, no need to style this! */}
          {/* </View> */}

          {/* <View style={styles.setStartEnd}>
            <Button onPress={this.setStartEnd}
              title={this.state.setStartEndVal==='start' ? 'Press StartPoint' : this.state.setStartEndVal==='end' ? 'Press EndPoint' : 'Generate Route Start/End'}
              ></Button>
          </View> */}

          { this.state.status ?
          <View style={styles.genRouteStatus}>
            <Text> {this.state.status} </Text>
          </View> : null }

       	 	<MapView style={styles.map}
            onPress={this.state.setStartEndVal ? this.setClickCoordinate : null}
            onRegionChange={this.onRegionChange}
            initialRegion={{latitude: 41.88782633760493, longitude: -87.64045111093955, latitudeDelta: .01, longitudeDelta: .01}}>

          {/* {querycoords.map(coord=>{
            return(<MapView.Marker
              coordinate={{ latitude: coord.latitude, longitude: coord.longitude}}
              // coordinate={{ latitude: 41.88782633760493, longitude: -87.64045111093955}}
              pinColor='purple'
              title='querycoord'
            />)
          })} */}

          {intersectionMarkers.map(intersection=>{
            return(
              intersection.connections.length>=4
              ?

              (<MapView.Marker
              coordinate={{ latitude: intersection.latitude, longitude: intersection.longitude}}
              identifier={ intersection.latitude+','+intersection.longitude }
              onSelect= { consoleLogIntersection }
              image={intersectImgMajor}
              // pinColor='black'
              title={intersection.latitude+','+intersection.longitude}
              />)

              :

              (<MapView.Marker
              coordinate={{ latitude: intersection.latitude, longitude: intersection.longitude}}
              identifier={ intersection.latitude+','+intersection.longitude }
              onSelect= { consoleLogIntersection }
              image={intersectImgMinor}
              // pinColor='grey'
              title={intersection.latitude+','+intersection.longitude}
              />)
            )
          })}

          { Object.keys(streetLookup).map(key=>{//THIS IS FOR DRAWING LINES BETWEEN INTERSECTIONS
            if(key!=='Alley'){
              let streetLineArr= streetLookup[key].map(intersectNode=>{
                return {latitude: intersectNode.latitude, longitude: intersectNode.longitude}
              })
              return(
                <MapView.Polyline
                  coordinates={streetLineArr}
                  // coordinates={[{latitude: 41.88782633760493, longitude: -87.64045111093955}, {latitude: 41.88782633760493, longitude: -87.64085111093955}]}
                  strokeColor='grey'
                  strokeWidth= {2}
                />
              )
            }
          }) }

          {routesArr.map((routeObj,idx)=>{
            let routeID = ""+routeObj.id;
            let colorsArr = ['#610', '#134', '#D90', 'black']
            let routeColor = colorsArr[routeObj.id % 4]

            return(
              <View key={routeObj.id} >



               <MapView.Polyline
                 coordinates={routeObj.convCoords}

                   strokeColor={routeColor}
                   strokeWidth= {5}
                   onPress={goToChooseYourOpponent.bind(this, routeObj.id)}
                 />


                 {/* {routeObj.convCoords.map(coords=>{
                   //USE THIS CODE FOR GET COORDINATES OF ROUTES (THAT YOU CAN CHANGE VIA PSQL LATER)
                   //DO NOT DELETE THIS SECTION !!!!!
                  //  let coords=coords.latitude+' '+coords.longitude
                   return(
                     <MapView.Marker
                       coordinate={{latitude: coords.latitude, longitude: coords.longitude}}
                       pinColor='grey'
                       title={coords.latitude+' '+coords.longitude}
                       // identifier={routeID}
                       // onSelect={goToChooseYourOpponent}
                     />
                   )
                 })} */}

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

          {generatedRoutes.map((route,idx)=>{
            if(idx=== genRouteNum){
              console.log('intersections to cross on this route: ',route.length)
              return (
                  <View key={idx} >
                    <MapView.Polyline
                      coordinates={route.map(intersectionNode=>{return {latitude: intersectionNode.latitude, longitude: intersectionNode.longitude}})}
                      strokeColor='yellow'
                      strokeWidth= {5}
                    />

                    {/* {route.map((intersectionNode,idx)=>{
                      return(
                      <MapView.Marker
                      coordinate={{ latitude: intersectionNode.latitude, longitude: intersectionNode.longitude}}
                      pinColor='blue'
                      title={JSON.stringify(idx)}
                    />
                  )
                })} */}

                <MapView.Marker
                  coordinate={{ latitude: route[0].latitude, longitude: route[0].longitude}}
                  pinColor='red'
                  title='Start'
                />
                <MapView.Marker
                  coordinate={{latitude: route[route.length-1].latitude, longitude: route[route.length-1].longitude}}
                  pinColor='blue'
                  title='End'
                />
              </View>
              )
            }
          })}

       	 </MapView>

      	</View>
        {//HERE'S THE POPUP MESSAGE, BELOW
      }

      {
        this.state.setStartEndVal === null ? null :
        <View style={{ position: 'absolute', top: 410}}>
          <Image source={require('../assets/chicagoSkylineSmaller.jpg')} />
          <View style={{width: 375, height: 156, backgroundColor: 'transparent', borderColor: 'black', borderWidth: 10, position: 'relative', top: -156}}></View>
          { this.state.setStartEndVal==='start' ?
          <Text style={{fontFamily: 'BudmoJiggler-Regular', fontSize: 40, backgroundColor: 'transparent', textAlign: 'center', bottom: 280}}>Starting where?</Text>
          :
          <Text style={{fontFamily: 'BudmoJiggler-Regular', fontSize: 40, backgroundColor: 'transparent', textAlign: 'center', bottom: 280}}>Ending where?</Text>
          }
          <Text style={{fontFamily: 'Magnum', fontSize: 50, textAlign: 'center', color: blueish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', bottom: 260, marginRight: 10 }}>Select on Map</Text>
        </View>
      }
      { this.state.status === 'Constructing City Layout' ?
        <View style={{ position: 'absolute', top: 410}}>
          <Image source={require('../assets/chicagoSkylineSmaller.jpg')} />
          <View style={{width: 375, height: 156, backgroundColor: 'transparent', borderColor: 'black', borderWidth: 10, position: 'relative', top: -156}}></View>
          <Text style={{fontFamily: 'BudmoJiggler-Regular', fontSize: 40, backgroundColor: 'transparent', textAlign: 'center', bottom: 280}}>CONSTRUCTING</Text>
          <Text style={{fontFamily: 'Magnum', fontSize: 50, textAlign: 'center', color: blueish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', bottom: 260, marginRight: 10 }}>CITY LAYOUT</Text>
        </View> : null
      }
      { this.state.status === 'Generating Route' ?
        <View style={{ position: 'absolute', top: 410}}>
          <Image source={require('../assets/chicagoSkylineSmaller.jpg')} />
          <View style={{width: 375, height: 156, backgroundColor: 'transparent', borderColor: 'black', borderWidth: 10, position: 'relative', top: -156}}></View>
          <Text style={{fontFamily: 'BudmoJiggler-Regular', fontSize: 40, backgroundColor: 'transparent', textAlign: 'center', bottom: 280}}>GENERATING</Text>
          <Text style={{fontFamily: 'Magnum', fontSize: 50, textAlign: 'center', color: blueish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', bottom: 260, marginRight: 10 }}>ROUTE</Text>
        </View>: null
      }
      {/* { this.state.status === 'Finalizing' ? ///////////////////Comment in when this status exists
        <View style={{ position: 'absolute', top: 410}}>
          <Image source={require('../assets/chicagoSkylineSmaller.jpg')} />
          <View style={{width: 375, height: 156, backgroundColor: 'transparent', borderColor: 'black', borderWidth: 10, position: 'relative', top: -156}}></View>
          <Text style={{fontFamily: 'BudmoJiggler-Regular', fontSize: 40, backgroundColor: 'transparent', textAlign: 'center', bottom: 280}}>Finalizing...</Text>
          <Text style={{fontFamily: 'Magnum', fontSize: 50, textAlign: 'center', color: blueish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', bottom: 260, marginRight: 10 }}></Text>
        </View> : null
      } */}
      {
        this.state.showFilter ?
        <View style={{ position: 'absolute', top: 410}}>
          <Image source={require('../assets/chicagoSkylineSmaller.jpg')} />
          <View style={{width: 375, height: 156, backgroundColor: 'transparent', borderColor: 'black', borderWidth: 10, position: 'relative', top: -156}}></View>
          <Text style={{fontFamily: 'BudmoJiggler-Regular', fontSize: 45, backgroundColor: 'transparent', textAlign: 'center', bottom: 290}}>Distance (miles)</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontFamily: 'Magnum', fontSize: 50, textAlign: 'center', color: blueish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', bottom: 270, marginRight: 10 }}>Min:</Text>
              <TextInput style={{height: 45, width: 65, backgroundColor: 'black', position: 'relative', bottom: 270, borderRadius: 20, borderWidth: 5, borderColor: blueish, textAlign: 'center', fontFamily: 'Magnum', fontSize: 28, color: yellowish, paddingTop: 5}} maxLength={4} keyboardType={'decimal-pad'} onChangeText={this.handleMinChange} />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontFamily: 'Magnum', fontSize: 50, textAlign: 'center', color: blueish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', bottom: 270, marginRight: 10 }}>Max:</Text>
              <TextInput style={{height: 45, width: 65, backgroundColor: 'black', position: 'relative', bottom: 270, borderRadius: 20, borderWidth: 5, borderColor: blueish, textAlign: 'center', fontFamily: 'Magnum', fontSize: 28, color: yellowish, paddingTop: 5}} maxLength={4} keyboardType={'decimal-pad'} onChangeText={this.handleMaxChange} />
            </View>
          </View>
        </View>
        : null
      }

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
