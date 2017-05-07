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
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {connect} from 'react-redux'
//CUSTOM MODULES
import styles from '../Styles';
import {fetchUser} from './storeAndReducer';

class Login extends Component {
  constructor(props){
    super(props)
    this.state={email:'',password:''}
    this.login=this.login.bind(this);
    this.changeTextHandlerEmail=this.changeTextHandlerEmail.bind(this);
    this.changeTextHandlerPw=this.changeTextHandlerPw.bind(this);
  }

  changeTextHandlerEmail(email){//you can also do onChangeText={(email) => this.setState({email})}   down there at the textinput thing.. just for future reference
    this.setState({email})
  }

  changeTextHandlerPw(password){//you can also do onChangeText={(password) => this.setState({password})}   down there at the textinput thing.. just for future reference
    this.setState({password})
  }

  login(){
    const { navigate } = this.props.navigation;

    this.props.fetchUser(this.state)
      .then(fetchUserRes=>{
        if(fetchUserRes==='userSetAllGravy') navigate('OurApp');
      })
      .catch(console.error)
  }

  render(){

    return (
      <View style={styles.container}>
        <Text>Email:</Text>
        <TextInput style={styles.input} onChangeText={this.changeTextHandlerEmail} />
        <Text>Password:</Text>
        <TextInput style={styles.input} onChangeText={this.changeTextHandlerPw} />
        <TouchableOpacity>
          <Button
          onPress={this.login}
          title="Login"
        />
        </TouchableOpacity>
      </View>
    )
  }
}

const mapDispatchToProps = {fetchUser}

const mapStateToProps = null;

var ConnectedLogin = connect(mapStateToProps, mapDispatchToProps)(Login);

export default ConnectedLogin;
