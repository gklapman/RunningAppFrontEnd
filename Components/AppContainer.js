import React, { Component } from 'react'
import ReactNative from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ReactNativeMaps }  from '../App'

import fetchRunnerCoords from './storeAndReducer'

const {
  View,
  Text,
} = ReactNative

class AppContainer extends Component {
  constructor(){
    super();
    this.state = { test: 0 }
  }

  addRunnerCoordsTest(){
    console.log("this state is", this.state)
    this.setState({
      runnerCoords: this.state.test++
    })
  }

  addRunnerCoordsOnStore(){
    console.log(this.state);
    var randomVal = Math.floor(Math.random() * 100)
    this.props.fetchRunnerCoords(randomVal)
  }



  render(){
    return (
      <View>
        <Text style={{margin: 30}}>
          FROM APP CONTAINER this.state.runnerCoords is: {this.state.runnerCoords}
        </Text>
        <TouchableOpacity onPress={() => {this.addRunnerCoordsTest()}}>
          <Text>test redux- add runner coords</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {this.addRunnerCoordsOnStore()}}>
          <Text>test redux- add runner coords</Text>
        </TouchableOpacity>
        {/* <ReactNativeMaps /> */}
      </View>
    )
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(fetchRunnerCoords, dispatch)
}

export default connect(() => {return {}}, mapDispatchToProps)(AppContainer)
