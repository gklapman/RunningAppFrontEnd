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
  ScrollView,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {connect} from 'react-redux'
//CUSTOM MODULES
import styles from '../Styles'
import {fetchUserStats} from './storeAndReducer'

class Stats extends Component {
  constructor(props) {
    super(props);

    this.viewRoute = this.viewRoute.bind(this)
    
  }

   viewRoute(event){
        let {convCoords, timesArr, startTime, endTime, opponentRoutetimeId} = event //the touchable opacity is bound to the route.id to use that as an identifier... it comes out as event
        // console.log('this is event', event)
        let userId = this.props.user.id
        let oldRoute = true

        
        const { navigate } = this.props.navigation;
        navigate('ViewRoute', {convCoords, userId, timesArr, startTime, endTime, oldRoute, opponentRoutetimeId})

    }

  componentWillMount() {
    let userId = this.props.user.id 
    console.log('this is front end fetch stats', userId)
    this.props.fetchUserStats(userId)

  }

  render() {
    console.log('user info', this.props.userStats)
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
                        let id = {convCoords: route.convCoords, timesArr: routetime.timesArr, startTime: routetime.startTime, endTime: routetime.endTime, opponentRoutetimeId: routetime.routetimeId}
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

      </View>
    )
  }
}

const mapDispatchToProps = {fetchUserStats}

function mapStateToProps(state){
  return {
    user: state.user,
    userStats: state.userStats
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Stats)