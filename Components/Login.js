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
  Linking
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {connect} from 'react-redux'
import BackgroundGeolocation from "react-native-background-geolocation";
//CUSTOM MODULES
import styles from '../Styles';
import {fetchUser} from './storeAndReducer';
import {redish, blueish, beige} from './Constants'



class Login extends Component {
  constructor(props){
    super(props)
    this.state={email:'',password:''}
    this.login=this.login.bind(this);
    this.changeTextHandlerEmail = this.changeTextHandlerEmail.bind(this)
    this.changeTextHandlerPw = this.changeTextHandlerPw.bind(this)

  }

  changeTextHandlerEmail(email){//you can also do onChangeText={(email) => this.setState({email})}   down there at the textinput thing.. just for future reference
    this.setState({email})
  }

  changeTextHandlerPw(password){//you can also do onChangeText={(password) => this.setState({password})}   down there at the textinput thing.. just for future reference
    this.setState({password})
  }

  onLocation(){
    //do nothing... we just want a listener so the thing woulD STOP FUCKING TELLING US IT'S SENDING LOCAITON WITH NO LISTENERS!!!
  }

  componentWillMount(){
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      stationaryRadius: 25,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: true,   // <-- Allow the background-service to continue tracking when user closes the app. //KEEP THIS ON TRUE... DO NOT FORGET ABOUT THIS
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up. //WE MAY NEED TO HAVE THIS TURNED OFF UNTIL THIS RUN COMPONENT MOUNTS (otherwise a lot of events emitted with no listeners, causing some yellow warnings)
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    }, function(state) {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      }
    });

    BackgroundGeolocation.on('location', this.onLocation)
  }

  componentWillUnmount(){
    BackgroundGeolocation.un('location', this.onLocation)
  }

  login(){
    const { navigate } = this.props.navigation;
    this.state={email: 'Charles@charles.com', password: '1234'}//COMMENT THIS WHEN WE ARE READY TO DO OUR PRESENTATION
    this.props.fetchUser(this.state)
      .then(fetchUserRes=>{
        if(fetchUserRes==='userSetAllGravy') navigate('OurApp');
      })
      .catch(console.error)

    // navigate('OurApp');//Uncomment if you want to test on iphone (but server is not deployed)
  }




  render(){

    return (
      <View style={styles.container}>
        <View style={{ position: 'relative', top: 30}}>
          <View style={{height: 100, width: 350, backgroundColor: beige, zIndex: -1, borderRadius: 100}}>
            <Text style={{fontFamily: 'BudmoJiggler-Regular', fontSize: 70, backgroundColor: 'transparent', textAlign: 'center', top: 10}}>PHANTOM</Text>
          </View>
          <Text style={{fontFamily: 'Airstream', fontSize: 120, textAlign: 'center', color: blueish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', top: -50, textAlign: 'right', marginRight: 5 }}>Racer</Text>
        </View>
        <View style={{ alignItems: 'center'}}>

          <View style={{position: 'relative', top: -30}}>
            <Image source={require('../assets/runnin.gif')} />
          </View>

            <Text style={{fontFamily: 'AvenirNext-HeavyItalic', fontSize: 20, fontWeight: '900', color: 'white', textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3}}>Email:</Text>
            <TextInput style={styles.input} onChangeText={this.changeTextHandlerEmail} />
            <Text style={{fontFamily: 'AvenirNext-HeavyItalic', fontSize: 20, fontWeight: '900', color: 'white', textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3}}>Password:</Text>
            <TextInput style={styles.input} onChangeText={this.changeTextHandlerPw} />

            <Text onPress={this.login} style={{fontFamily: 'Airstream', fontSize: 50, textAlign: 'center', color: 'white', textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', textAlign: 'right', marginRight: 5, position: 'relative', top: 25 }}>Login</Text>
            <View style={{height: 50, width: 200, backgroundColor: blueish, zIndex: -1, borderRadius: 100, position: 'relative', top: -35}}></View>

        </View>
      </View>
    )
  }
}

class Triangle extends Component {
  render() {
    return (
      <View style={styles.triangle}>
      </View>
    )
  }
}
class TriangleRight extends Component {
  render() {
    return (
      <Triangle style={styles.triangleRight}>
      </Triangle>
    )
  }
}



const mapDispatchToProps = {fetchUser }

const mapStateToProps = null;

var ConnectedLogin = connect(mapStateToProps, mapDispatchToProps)(Login);

export default ConnectedLogin;
