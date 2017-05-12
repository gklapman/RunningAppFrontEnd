
import React from 'react';
import {
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    // display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: 'black',
    marginBottom: 5,
  },
  navigationBar: {
    margin: 5,
    paddingTop: 15,
    flexDirection: 'row',
    backgroundColor: 'grey',
    position: 'absolute',
    paddingTop: 0,
    bottom: 5,
    height: 64,
    right: 0,
    left: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: 'white',
  },
  navButton: {
    color: 'white',
    textAlign: 'center',
    margin: 15,
    width: '17%',
    // flexBasis: 'auto',
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    height: 30,
    lineHeight: 30,
    marginTop: 10,
    textAlign: 'center',
    width: 250
  },
  input: {
    margin: 'auto',//CAN'T GET THIS TO CENTER NO MATTER WHAT
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: 37,
    width: 250
  },
  mapcontainer: {
    height: 600,
    width: 400,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex'

  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    zIndex: 0,

  },
    icon: {
    width: 26,
    height: 26,
  },
  createRoute: {
    height: 50,
    width: 100,
    backgroundColor: '#b0c4de',
    zIndex: 1,
    position: 'absolute',
    top: 30,
    right: 50,
  },
  filter: {
    zIndex: 1,
    height: 50,
    width: 100 ,
    backgroundColor: 'blue',
    position: 'absolute',
    top: 30,
    left: 50,
  },
  genRoute: {
    zIndex: 1,
    height: 50,
    width: 100 ,
    backgroundColor: 'blue',
    position: 'absolute',
    top: 60,
    left: 50,
  },
    timer: {
    height: 50,
    width: 100,
    backgroundColor: '#b0c4de',
    zIndex: 1,
    position: 'absolute',
    top: 30,
    right: 50,
  },
   startStop: {
    zIndex: 1,
    height: 50,
    width: 100 ,
    backgroundColor: 'blue',
    position: 'absolute',
    top: 30,
    left: 50,
  },
  viewRoute: {
    zIndex: 1,
    height: 50,
    width: 100 ,
    backgroundColor: 'orange',
    position: 'absolute',
    top: 30,
    left: 50,
  },
    finalTime: {
    zIndex: 1,
    height: 50,
    width: 100 ,
    backgroundColor: 'blue',
    position: 'absolute',
    top: 30,
    left: 50,
  },
   submitRoute: {
    zIndex: 1,
    height: 50,
    width: 100 ,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 30,
    left: 50,
  },
  replayRoute: {
    zIndex: 1,
    height: 50,
    width: 100 ,
    backgroundColor: 'orange',
    position: 'absolute',
    bottom: 30,
    right: 50,
  },
  finalDistance: {
    height: 50,
    width: 100,
    backgroundColor: '#b0c4de',
    zIndex: 1,
    position: 'absolute',
    top: 30,
    right: 50,
  },
   changeView: {
    zIndex: 1, 
    height: 50,
    width: 100 , 
    backgroundColor: 'orange',
    position: 'absolute',
    top: 30,
    left: 50,
  }, 
  changeType: {
    zIndex: 1, 
    height: 50,
    width: 100 , 
    backgroundColor: 'green',
    position: 'absolute',
    top: 100,
    left: 100,
  },
  userHeader: {
    display: 'flex',
    backgroundColor: 'orange',
    height: 200,
    width: 500,
    justifyContent: 'center',

  },
  userCity: {
    justifyContent: 'center'
  },
  userName: {
    alignItems: 'center'
  },
  userStats: {
    margin: 2
  }
  });

export default styles
