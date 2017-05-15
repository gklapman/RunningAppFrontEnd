import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  Linking
} from 'react-native';
import styles from '../Styles'
import {redish, blueish, beige, yellowish} from './Constants'

// export class Btn extends React.Component {
//   render(){
//     return(
//       <View style={{height: 50, width: 100, backgroundColor: '#5577BB', zIndex: 1, borderRadius:  30}}>
//         <Text style={{fontSize: 25, fontFamily: 'Airstream', color: 'black', textAlign: 'center', marginTop: 5}}>
//           {this.props.children}
//         </Text>
//       </View>
//     )
//   }
// }

export class Btn extends React.Component {
  render(){
    return(
      <View style={{alignItems: 'center', position: 'relative', top: -20, justifyContent: 'space-around'}}>
        <Text style={{fontFamily: 'Magnum', fontSize: 22, textAlign: 'center', color: yellowish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', top: 26, textAlign: 'right', marginRight: 5 }}>{this.props.children}</Text>
        <View style={{height: 50, width: 160, backgroundColor: blueish, zIndex: -1, borderRadius: 100, borderWidth: 3, borderColor: yellowish}}></View>
      </View>
    )
  }
}

export class BtnSm extends React.Component {
  render(){
    return(
      <View style={{alignItems: 'center', position: 'relative', top: -20, justifyContent: 'space-around'}}>
        <Text style={{fontFamily: 'Magnum', fontSize: 20, textAlign: 'center', color: yellowish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', top: 26, textAlign: 'right', marginRight: 5 }}>{this.props.children}</Text>
        <View style={{height: 50, width: 120, backgroundColor: blueish, zIndex: -1, borderRadius: 100, borderWidth: 3, borderColor: yellowish}}></View>
      </View>
    )
  }
}

export class BigBtn extends React.Component {
  render(){
    return(
      <View style={{alignItems: 'center', position: 'relative', bottom: 10}}>
        <Text style={{fontFamily: 'Airstream', fontSize: 40, textAlign: 'center', color: yellowish, textShadowColor: 'black', textShadowOffset: {width: 3, height: 3}, textShadowRadius: 3, backgroundColor: 'transparent', position: 'relative', bottom: -53, textAlign: 'right', marginRight: 5 }}>{this.props.children}</Text>
        <View style={{height: 50, width: 250, backgroundColor: blueish, zIndex: -1, borderRadius: 100, borderWidth: 3, borderColor: yellowish}}></View>
      </View>
    )
  }
}


export class BtnHolder extends React.Component {
  render(){
    return(
      <View style={styles.btnHolder}>
        {this.props.children}
      </View>
    )
  }
}
