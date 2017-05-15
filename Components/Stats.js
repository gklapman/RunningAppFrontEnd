//REACT MODULES
import React, { Component } from 'react';
import store from './storeAndReducer'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
  ScrollView,
  Linking,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {connect} from 'react-redux'
//CUSTOM MODULES
import styles from '../Styles'
import {fetchUserStats, fetchFitBitHeartrateInfo, insertHeartRateInfo, setFitBitToken, logout} from './storeAndReducer'
import config from '../config'
import qs from 'qs'

function OAuth(client_id, cb) {

 // Listen to redirection
Linking.addEventListener('url', handleUrl);
function handleUrl(event){
  // console.log(event.url);
  Linking.removeEventListener('url', handleUrl);
  const [, query_string] = event.url.match(/\#(.*)/);
  // console.log(query_string);

  const query = qs.parse(query_string);
  // console.log(`query: ${JSON.stringify(query)}`);

  store.dispatch(setFitBitToken(query.access_token))
  cb(query.access_token);
}

 // Call OAuth
const oauthurl = 'https://www.fitbit.com/oauth2/authorize?'+
          qs.stringify({
            client_id,
            response_type: 'token',
            scope: 'heartrate activity activity profile sleep',
            redirect_uri: 'runningapp://oauth',
            expires_in: '31536000',
            //state,
          });
// console.log(oauthurl);
Linking.openURL(oauthurl).catch(err => console.error('Error processing linking', err));
}

//getting heartrate data for the day... no need to actually have this besides seeing what data we have to work with for the day
function getData(access_token) {
fetch(
   'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json',
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
    //body: `root=auto&path=${Math.random()}`
  })
  .then((res) => {
    return res.json()
  })
  .then((res) => {
  console.log(`res: ${JSON.stringify(res)}`);
  })
  .catch((err) => {
  console.error('Error: ', err);
  })
}

class Stats extends Component {
  constructor(props) {
    super(props);

    this.viewRoute = this.viewRoute.bind(this)
    this.connectToFitBit = this.connectToFitBit.bind(this)
    this.logout = this.logout.bind(this)
  }

   viewRoute(event){
        let {personalCoords, personalTimeMarker, startTime, endTime, phantomRacerRoutetimeId, routetimeId, heartrateInfo} = event //the touchable opacity is bound to the route.id to use that as an identifier... it comes out as event
        let userId = this.props.user.id
        let oldRoute = true
        // let heartRateInfo;
        // console.log('this props ', this.props, heartrateInfo)
        if (this.props.fitbitAccessToken && !heartrateInfo){
          console.log('about to fetch')
        return this.props.fetchFitBitHeartrateInfo(startTime, endTime, routetimeId)
        .then((heartRateInfoReceived) => {
          // console.log('and we got this info ', heartRateInfoReceived)
          if (typeof(heartRateInfoReceived) === 'string'){
            alert('Your heartrate data is not available yet')
          }
          else { heartrateInfo = heartRateInfoReceived
          this.props.insertHeartRateInfo(routetimeId, heartrateInfo)
          }
          const { navigate } = this.props.navigation
          navigate('ViewRoute', {personalCoords, personalTimeMarker, userId, startTime, endTime, oldRoute, phantomRacerRoutetimeId, heartrateInfo})
        })
        .catch(err => {
          console.log(err)
        })
        } else {
        const { navigate } = this.props.navigation;
        navigate('ViewRoute', {personalCoords, personalTimeMarker, userId, startTime, endTime, oldRoute, phantomRacerRoutetimeId, heartrateInfo})
      }
    }


  connectToFitBit(){
    OAuth(config.client_id, getData);
  }

  componentWillMount() {
    
    let userId = this.props.user.id
    // console.log('this is front end fetch stats', userId)
    this.props.fetchUserStats(userId)

  }

  logout () {
    this.props.logout()
    const { navigate } = this.props.navigation;
    navigate('Login')
  }

  render() {
    console.log('user info', this.props.fitbitAccessToken)
    let userStats = this.props.userStats

    return (
      <View>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{userStats.username}</Text>
          <Text style={styles.userCity}>{userStats.city}</Text>
        </View>
        <ScrollView style={{height: 200}}>
        {userStats.routes && userStats.routes.map(route => {
          return (<View style={styles.userStats}key={route.id}>
                      <Text> Route Id: {route.id} </Text>
                      <Text>Time(s): </Text>{route.routetimes.map(routetime => {
                        let id = {routetimeId: routetime.id, personalCoords: routetime.personalCoords, personalTimeMarker: routetime.personalTimeMarker, startTime: routetime.startTime, endTime: routetime.endTime, phantomRacerRoutetimeId: routetime.routetimeId, heartrateInfo: routetime.heartrateInfo}
                        return (<TouchableOpacity
                          style={{margin: 2}}
                          onPress={this.viewRoute.bind(this, id)}
                          key={routetime.id}>
                          <Text>{routetime.runtime}</Text>
                          </TouchableOpacity>)
                      })}
                      <Text>Total Dist: {route.totalDist}</Text>

                  </View>)
        }) }
        </ScrollView>
        
        {!this.props.fitbitAccessToken ?
        <TouchableOpacity>
          <Button
          onPress={this.connectToFitBit}
          title="Connect To FitBit"
        />
        </TouchableOpacity> : null }
        <TouchableOpacity>
          <Button
          onPress={this.logout}
          title="Logout"
        />
        </TouchableOpacity>

      </View>
    )
  }
}

const mapDispatchToProps = {fetchUserStats, fetchFitBitHeartrateInfo, insertHeartRateInfo, setFitBitToken, logout}

function mapStateToProps(state){
  return {
    user: state.user,
    userStats: state.userStats,
    fitbitAccessToken: state.fitbitAccessToken
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Stats)
