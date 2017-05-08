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
import {sendSelectedRacer} from './storeAndReducer'


class OpponentsView extends Component {
    constructor(){
      super();

      this.goToRace = this.goToRace.bind(this)
    }

    goToRace(userIdx){
      const { navigate } = this.props.navigation;
      let racer = this.props.selectedRoute.users[userIdx]
      this.props.sendSelectedRacer(racer)
      // navigate('CHARLES WAS WORKING ON THIS COMPONENT')
    }

    render(){


    const users = this.props.selectedRoute.users
    const filterStyle = {width: 5, height: 5, backgroundColor: 'skyblue'}

    return(
      <View style={styles.container}>
        <View style={{borderColor: 'white', borderWidth: 3, alignItems: 'center', margin: 3}}>
          <Text style={{fontFamily: 'chalkduster', backgroundColor: 'maroon', color: 'white',fontSize: 18, fontWeight: 'bold', padding: 5, paddingLeft: 50, paddingRight: 50}}>CHOOSE YOUR OPPONENT</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-start', padding: 3, backgroundColor: 'green', marginBottom: 8}}>
          <View style={{flex: 0, flexDirection: 'row', borderColor: 'green', borderWidth: 3, justifyContent: 'space-around'}}>
            <Text style={{fontFamily: 'american typewriter', width: '48%', height: 30, color: 'white', borderColor: 'white', borderWidth: 3, textAlign: 'center', fontSize: 20, fontWeight: 'bold', padding: 3, backgroundColor: 'crimson'}}>Racer</Text>
            <Text style={{fontFamily: 'american typewriter', width: '48%', height: 30, color: 'white', borderColor: 'white', borderWidth: 3, textAlign: 'center', fontSize: 20, fontWeight: 'bold', padding: 3, backgroundColor: 'crimson'}}>Time</Text>
          </View>
          {
            users && users.map((user, idx) =>{
              let userRuntime = user.routetimes[0].runtime

              return (
                <View key={user.id} style={{flex: 0, flexDirection: 'row', borderColor: 'green', borderWidth: 3, justifyContent: 'space-around'}}>
                  <Text style={{fontFamily: 'chalkduster', width: '48%', height: 30, color: 'white', borderColor: 'white', borderWidth: 3, textAlign: 'center', fontSize: 15, fontWeight: 'bold', padding: 5, backgroundColor: 'darkblue'}} ref={idx} onPress={() => this.goToRace(idx)}>{user.username}</Text>
                  <Text style={{fontFamily: 'chalkduster', width: '48%', height: 30, color: 'white', borderColor: 'white', borderWidth: 3, textAlign: 'center', fontSize: 15, fontWeight: 'bold', padding: 5, backgroundColor: 'darkblue'}}>{userRuntime}</Text>
                </View>
              )
            })
          }
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
