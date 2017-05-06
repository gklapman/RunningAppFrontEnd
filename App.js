/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {Provider, connect } from 'react-redux'
import store from './Components/storeAndReducer'
import { fetchRunnerCoords } from './Components/storeAndReducer'

import React, { Component } from 'react';
import axios from 'axios';
import {StackNavigator, TabNavigator} from 'react-navigation';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';


//Styles
import styles from './Styles'

//components
import Login from './Components/Login'
import Stats from './Components/Stats'
import Run from './Components/Run'
import MakeRoute from './Components/MakeRoute'




const OurApp = TabNavigator({
  Stats: {screen: Stats },
  Run: {screen: Run},

  },
  {
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },

});


//IN DOCS, THIS IS CALLED "AppNavigator"
const ReactNativeMaps = StackNavigator({
  Login: { screen: Login },
  OurApp: { screen: OurApp },
  MakeRoute: {screen: MakeRoute},
});

//TRY TO STYLE MAP IN ABSOLUTE IF NOT RENDERING PROPERLY



const App = () => (
  <Provider store={store}>
    <ConnectedAppContainer />
  </Provider>
)
// // //if in a different file, you have to import...
// // import React, { Component } from 'react'
// // import ReactNative from 'react-native'
// // import { connect } from 'react-redux'
// // import { bindActionCreators } from 'redux'
//
// //import { ReactNativeMaps }  from '../App'
//
// // //import actionCreators from store
//
// // const {
// //   View,
// //   Text,
// // } = ReactNative
//
class AppContainer extends Component {

  addRunnerCoordsOnStore(){
    // console.log("FETCH RUNNER COORDS",this.props.fetchRunnerCoords)
    console.log(this.state);
    var randomVal = Math.floor(Math.random() * 100)
    this.props.fetchRunnerCoords(randomVal)
  }



  render(){
    // console.log("this.state is", this.state)
    // console.log("this.props is", this.props)
    return (
      <View style={{flex: 1}}>
        <ReactNativeMaps />
      </View>
    )
  }
}

// function mapDispatchToProps(dispatch){
//
//   return bindActionCreators({fetchRunnerCoords}, dispatch)
// }

const mapDispatchToProps = {fetchRunnerCoords}

function mapStateToProps(state){
  return {
    runnerCoords: state.runnerCoords
  }
}

var ConnectedAppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainer)

AppRegistry.registerComponent('ReactNativeMaps', () => App);


///////EXAMPLE BELOW- not sure it's still needed

// export class ReactNativeMaps extends Component {

//   render() {
//     return (
//       <View style={styles.container}>
//         <Map />
//       </View>
//     );
//   }
// }




/*
why is the title not showing up?



*/

// class HomeScreen extends React.Component {
//   static navigationOptions = {
//     title: 'Welcome',
//   };
//   render() {
//     const { navigate } = this.props.navigation;
//     return (
//       <View>
//         <Text>Hello, Chat App!</Text>
//         <Button
//           onPress={() => navigate('Chat', { user: 'Lucy' })}
//           title="Chat with Lucy"
//         />
//       </View>
//     );
//   }
// }

// class HomeScreen extends React.Component {
//   // static navigationOptions = {
//   //   tabBarLabel: 'Home',
//   //   tabBarIcon: ({ tintColor }) => (
//   //     <Image
//   //       // source={require('https://cdn3.iconfinder.com/data/icons/mobiactions/512/chats_folder-512.png')}
//   //       source='https://cdn3.iconfinder.com/data/icons/mobiactions/512/chats_folder-512.png'
//   //       style={[styles.icon, {tintColor: tintColor}]}
//   //     />
//   //   ),
//   // };
//   render() {
//     const { navigate } = this.props.navigation;
//     return (
//       <View>
//       <Text>asdfasdf</Text>
//       <Button
//         onPress={() => this.props.navigation.navigate('Notifications')}
//         title="Go to notificationsssss"
//       />
//       </View>
//     );
//   }
// }

// class MyNotificationsScreen extends React.Component {
//   static navigationOptions = {
//     tabBarLabel: 'Notifications',
//     tabBarIcon: ({ tintColor }) => (
//       <Image
//         source='https://d30y9cdsu7xlg0.cloudfront.net/png/194977-200.png'
//         style={[styles.icon, {tintColor: tintColor}]}
//       />
//     ),
//   };

//   render() {
//     return (
//       <Button
//         onPress={() => this.props.navigation.goBack()}
//         title="Go back home"
//       />
//     );
//   }
// }

// class ChatScreen extends React.Component {
//   // Nav options can be defined as a function of the screen's props:
//   static navigationOptions = ({ navigation }) => ({
//     title: `Chat with ${navigation.state.params.user}`,
//   });
//   render() {
//     // The screen's current route is passed in to `props.navigation.state`:
//     const { params } = this.props.navigation.state;
//     return (
//       <View>
//         <Text>Chat with {params.user}</Text>
//       </View>
//     );
//   }
// }

const OurApp = TabNavigator({
  Stats: {screen: Stats },
  Run: {screen: Run},

  },
  {
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },

});


//IN DOCS, THIS IS CALLED "AppNavigator"
const ReactNativeMaps = StackNavigator({
  Login: { screen: Login },
  OurApp: { screen: OurApp },
  MakeRoute: {screen: MakeRoute},
});

//TRY TO STYLE MAP IN ABSOLUTE IF NOT RENDERING PROPERLY



const App = () => (
  <Provider store={store}>
    <ConnectedAppContainer />
  </Provider>
)
// // //if in a different file, you have to import...
// // import React, { Component } from 'react'
// // import ReactNative from 'react-native'
// // import { connect } from 'react-redux'
// // import { bindActionCreators } from 'redux'
//
// //import { ReactNativeMaps }  from '../App'
//
// // //import actionCreators from store
//
// // const {
// //   View,
// //   Text,
// // } = ReactNative

class AppContainer extends Component {

  addRunnerCoordsOnStore(){
    // console.log("FETCH RUNNER COORDS",this.props.fetchRunnerCoords)
    console.log(this.state);
    var randomVal = Math.floor(Math.random() * 100)
    this.props.fetchRunnerCoords(randomVal)
  }



  render(){
    // console.log("this.state is", this.state)
    // console.log("this.props is", this.props)
    return (
      <View style={{flex: 1}}>
        <ReactNativeMaps />

        {/* <TouchableOpacity onPress={() => {this.addRunnerCoordsOnStore()}}>
          <Text>test redux- add runner coords</Text>
        </TouchableOpacity> */}
      </View>
    )
  }
}

// function mapDispatchToProps(dispatch){
//
//   return bindActionCreators({fetchRunnerCoords}, dispatch)
// }

const mapDispatchToProps = {fetchRunnerCoords}

function mapStateToProps(state){
  return {
    runnerCoords: state.runnerCoords
  }
}

var ConnectedAppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainer)


AppRegistry.registerComponent('ReactNativeMaps', () => App);
