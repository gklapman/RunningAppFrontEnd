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
import {fetchUserStats, fetchFitBitHeartrateInfo, insertHeartRateInfo, setFitBitToken} from './storeAndReducer'
import config from '../config'
import qs from 'qs'
import  {Btn, BigBtn} from './Wrappers'
import {redish, blueish, beige, yellowish, orangeish} from './Constants'

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
  }

   viewRoute(event){
        let {personalCoords, personalTimeMarker, startTime, endTime, phantomRacerRoutetimeId, routetimeId, heartrateInfo} = event //the touchable opacity is bound to the route.id to use that as an identifier... it comes out as event
        let userId = this.props.user.id
        let oldRoute = true
        // let heartRateInfo;
        if (this.props.fitbitAccessToken && !heartrateInfo){
        return this.props.fetchFitBitHeartrateInfo(startTime, endTime, routetimeId)
        .then((heartRateInfoReceived) => {
          heartrateInfo = heartRateInfoReceived
          this.props.insertHeartRateInfo(routetimeId, heartrateInfo)
          const { navigate } = this.props.navigation
          navigate('ViewRoute', {personalCoords, personalTimeMarker, userId, startTime, endTime, oldRoute, phantomRacerRoutetimeId, heartrateInfo})
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
    console.log('this is')
    let userId = this.props.user.id
    console.log('this is front end fetch stats', userId)
    this.props.fetchUserStats(userId)

  }


  render() {
    console.log('user info', this.props.userStats)
    let userStats = this.props.userStats

    return (
      <View style={styles.container2}>
        <View style={{ width: 375, height: 100, backgroundColor: redish, alignItems: 'center'}}>
          <Text style={{color: blueish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, fontFamily: 'Airstream', fontSize: 45, backgroundColor: 'transparent', zIndex: 1, paddingTop: 10}}>{userStats.username}</Text>
          <Text style={{fontFamily: 'budmo', fontSize: 40, color: 'black', position: 'relative', top: -10, zIndex: 0 }}>{userStats.city}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'black'}}>
          <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5}}>
            <Text style={styles.scrollListHeader}>Route ID</Text>
            <Text style={styles.scrollListHeader}>Distance (mi)</Text>
            <Text style={styles.scrollListHeader}>Time(s)</Text>
          </View>


        <ScrollView>
        {userStats.routes && userStats.routes.map(route => {
          let rowStyle = route.id % 2 === 0 ? styles.scrollListRowEven : styles.scrollListRowOdd
          return (<View key={route.id} style={rowStyle} key={route.id}>
                      <Text style={styles.scrollListItem}> {route.id} </Text>
                      <Text style={styles.scrollListItem}>{route.totalDist}</Text>
                      {route.routetimes.map(routetime => {
                        let id = {routetimeId: routetime.id, personalCoords: routetime.personalCoords, personalTimeMarker: routetime.personalTimeMarker, startTime: routetime.startTime, endTime: routetime.endTime, phantomRacerRoutetimeId: routetime.routetimeId, heartrateInfo: routetime.heartrateInfo}
                        return (<TouchableOpacity
                          style={styles.scrollListItem}
                          onPress={this.viewRoute.bind(this, id)}
                          key={routetime.id}>
                          <Text style={{fontFamily: 'Ghoulish Intent', fontSize: 18, textAlign: 'right', color: yellowish,     textShadowColor: 'black',
                              textShadowOffset: {width: 3, height: 3},
                              textShadowRadius: 3,}}>{routetime.runtime}</Text>
                          </TouchableOpacity>)
                      })}
                  </View>)
        }) }
        </ScrollView>
        </View>


        {/* <TouchableOpacity style={{margin: 2, borderColor: 'black', borderWidth: 3}}>
          <Button
          onPress={this.connectToFitBit}
          title="Connect To FitBit"
        />
        </TouchableOpacity> */}

        <BigBtn>
          <Text onPress={this.connectToFitBit}>
            Connect to FitBit
          </Text>
        </BigBtn>

      </View>
    )
  }
}

const mapDispatchToProps = {fetchUserStats, fetchFitBitHeartrateInfo, insertHeartRateInfo, setFitBitToken}

function mapStateToProps(state){
  return {
    user: state.user,
    userStats: state.userStats,
    fitbitAccessToken: state.fitbitAccessToken
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Stats)
