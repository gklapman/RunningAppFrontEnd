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
  ScrollView
} from 'react-native'
import styles from '../Styles'
import {StackNavigator} from 'react-navigation'
import MapView from 'react-native-maps'

//added for react-redux
import {connect} from 'react-redux'
import {sendSelectedRacer} from './storeAndReducer'
import {redish, blueish, beige} from './Constants'



class OpponentsView extends Component {
    constructor(){
      super()
      this.goToRace = this.goToRace.bind(this)
    }

    goToRace(userIdx){
      const { navigate } = this.props.navigation
      console.log('this is users', this.props.selectedRoute.users)
      let racer = this.props.selectedRoute.users[userIdx]
      this.props.sendSelectedRacer(racer)
      navigate('RunARoute')
    }

    render(){
      console.log('this is props ', this.props)

    const users = this.props.selectedRoute.users
    const filterStyle = {width: 5, height: 5, backgroundColor: 'skyblue'}

    return(
      <View style={styles.container}>
        <View style={{height: 150, width: 300, alignItems: 'center', borderRadius: 200, marginTop: 5, marginBottom: 5}}>
          <View style={{height: 50, width: 300, borderRadius: 150, alignItems: 'center', backgroundColor: beige}}></View>
          <Text style={{fontFamily: 'Airstream', fontSize: 50, textAlign: 'center', color: blueish, textShadowColor: 'black', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 1, backgroundColor: 'transparent', position: 'relative', top: -50, zIndex: 1}}>Choose Your</Text>
          <View style={{height: 50, width: 350, alignItems: 'center', backgroundColor: 'black', position: 'relative', top: -70}}></View>
          <Text style={{height: 50, fontFamily: 'budmo', fontSize: 50, color: 'white', position: 'relative', top: -123, zIndex: 1, backgroundColor: 'transparent'}}>OPPONENT</Text>
        </View>

        <View style={{flex: 1, padding: 3, backgroundColor: redish, position: 'relative', top: -50}}>
          <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5}}>
            <Text style={{fontFamily: 'AvenirNext-HeavyItalic', fontWeight: '900', width: '50%', height: 30, color: redish, textAlign: 'center', fontSize: 20, padding: 3, backgroundColor: 'white'}}>Racer</Text>
            <Text style={{fontFamily: 'AvenirNext-HeavyItalic', fontWeight: '900', width: '50%', height: 30, color: blueish, textAlign: 'center', fontSize: 20, padding: 3, backgroundColor: beige}}>Time</Text>
          </View>
          <ScrollView>
          {
            users && users.map((user, idx) =>{
              let userRuntime = user.routetimes[0].runtime
              let rowStyle = idx % 2 !== 0 ? styles.scrollListRowEven : styles.scrollListRowOdd
              return (
                <View key={user.id} style={rowStyle}>
                  <Text style={styles.scrollListItem2} ref={idx} onPress={() => this.goToRace(idx)}>{user.username}</Text>
                  <Text style={styles.scrollListItem2}>{userRuntime}</Text>
                </View>
              )
            })
          }
        </ScrollView>
        </View>
      </View>
    )
  }
}



const mapDispatchToProps = {sendSelectedRacer}

function mapStateToProps(state){
  return {
    selectedRoute: state.selectedRoute,
  }
}


var ChooseYourOpponent = connect(mapStateToProps, mapDispatchToProps)(OpponentsView)


export default ChooseYourOpponent
