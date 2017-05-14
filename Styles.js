
import React from 'react';
import {
  StyleSheet
} from 'react-native';
import {redish, blueish, beige} from './Components/Constants'

const styles = StyleSheet.create({
  container: {
    // display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: redish,
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
    backgroundColor: 'blue',
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
    fontFamily:'AvenirNext-Heavy',
    backgroundColor: beige,
    margin: 'auto',
    padding: 10,
    textAlign: 'center',
    borderColor: beige,
    borderWidth: 3,
    borderRadius: 18,
    height: 35,
    width: 250,
  },
  mapcontainer: {
    height: 555,
    width: 375,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex'
  },
  mapcontainerNoNav: {
    height: 600,
    width: 375,
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
    // position: 'absolute',
    // top: 30,
    // right: 50,
  },
  filter: {
    zIndex: 1,
    height: 50,
    width: 100 ,
    backgroundColor: 'blue',
    // position: 'absolute',
    // top: 30,
    // left: 50,
  },
  btnHolder: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
    height: 50,
    width: '100%',
    // backgroundColor: 'orange',
    position: 'absolute',
    top: 20,
    alignItems: 'center',
    justifyContent: 'space-around'
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
  },
  scrollListRow: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  scrollListRowOdd: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: '#999999',
    borderWidth: 1,
    borderColor: beige,
  },
  scrollListRowEven: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: 'white',
    borderWidth: 1,
    borderColor: beige,
  },
  scrollListItem: {
    textAlign: 'center',
    fontFamily:'AvenirNext-Heavy',
    fontSize: 18,
    color: beige,
    backgroundColor: 'transparent',
    width: '30%',
    textShadowColor: 'black',
    textShadowOffset: {width: 3, height: 3},
    textShadowRadius: 3,
  },
  scrollListItem2: {
    textAlign: 'center',
    fontFamily:'AvenirNext-Heavy',
    fontSize: 14,
    color: beige,
    backgroundColor: 'transparent',
    width: '48%'
  }

  });

export default styles
