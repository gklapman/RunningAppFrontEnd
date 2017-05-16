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
import TimeFormatter from 'minutes-seconds-milliseconds'

//added for react-redux
import {connect} from 'react-redux'
import {sendSelectedRacer} from './storeAndReducer'
import {redish, blueish, beige, yellowish} from './Constants'
import {Triangle, Triangle2} from './Wrappers'



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
    // borderWidth: 3, borderColor: 'red'
    return(
      <View style={styles.container2}>

        <Image source={require('../assets/chicagoSkylineSmaller.jpg')}>

          <View style={{ width: 375, height: 60, backgroundColor: 'transparent', alignItems: 'center', zIndex: 0}}>
            <Text style={{color: 'black', fontFamily: 'budmo', fontSize: 50, backgroundColor: 'transparent', zIndex: 3, paddingTop: 5}}>Choose Your</Text>
            <Text style={{fontFamily: 'Magnum', fontSize: 75, color: blueish, backgroundColor: 'transparent', position: 'relative', top: 20, left: -20, zIndex: 3, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, }}>OPPONENT</Text>
          </View>
        </Image>




        {/* <Triangle /> */}
        {/* <View style={{borderWidth: 3, borderColor: 'red',height: 130, width: 300, alignItems: 'center', marginTop: 5, marginBottom: 5, position: 'relative', top: -20}}>
          <View style={{borderWidth: 3, borderColor: 'purple',height: 50, width: 300, borderRadius: 150, alignItems: 'center', backgroundColor: yellowish}}></View>
          <Text style={{fontFamily: 'Magnum', fontSize: 50, textAlign: 'center', color: blueish, textShadowColor: 'black', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 1, backgroundColor: 'transparent', position: 'relative', top: -50, zIndex: 1}}>Choose Your</Text>
          <View style={{borderWidth: 3, borderColor: 'green',height: 50, width: 300, alignItems: 'center', backgroundColor: 'transparent', position: 'relative', top: -70}}></View>
          <Text style={{borderWidth: 3, borderColor: 'white',height: 50, fontFamily: 'Vicious Hunger', fontSize: 50, color: redish, position: 'relative', top: -123, zIndex: 1, backgroundColor: 'transparent', textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3}}>OPPONENT</Text>
        </View> */}



        <View style={{flex: 1, padding: 3, backgroundColor: 'black', position: 'relative'}}>
          <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5}}>
            <Text style={styles.scrollListHeader2}>Racer</Text>
            <Text style={styles.scrollListHeader2}>Time</Text>
          </View>
          <ScrollView>
          {
            users && users.map((user, idx) =>{
              let placeHolderNames = ['Gabi', 'Charles', 'Alyssa', 'Codi']
              let nameStyle = idx % 2 === 0 ? styles.scrollListItemOppNameEven : styles.scrollListItemOppNameOdd
              let userRuntime = user.routetimes[0].runtime
              let rowStyle = idx % 2 !== 0 ? styles.scrollListRowEven : styles.scrollListRowOdd
              return (
                <View key={user.id} style={rowStyle}>
                  {/* <Text style={styles.scrollListItem2} ref={idx} onPress={() => this.goToRace(idx)}>{user.username}</Text> CHANGE IT BACK TO THIS AFTER GETTING SHORTER USERNAMES*/}
                  <View style={nameStyle}>
                    <Text style={styles.scrollListItemOppName} ref={idx} onPress={() => this.goToRace(idx)}>{placeHolderNames[idx]}</Text>
                  </View>
                  <Text style={styles.scrollListItem2}>{TimeFormatter(userRuntime)}</Text>

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
