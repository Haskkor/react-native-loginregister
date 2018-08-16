import * as React from 'react'
import { Dimensions, Platform, StatusBar, View } from 'react-native'

export const isIphoneX = () => {
  const {height, width} = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    (height === 812 || width === 812)
  )
}

class FlexibleStatusBar extends React.Component {
  render () {
    return(
      isIphoneX() ?
        <View style={{height: 44, backgroundColor: 'rgba(0,0,0,0)'}}><StatusBar barStyle="dark-content"/></View> :
        <View style={{height: 24, backgroundColor: 'rgba(0,0,0,0)'}}><StatusBar barStyle="dark-content"/></View>
    )
  }
}
export default FlexibleStatusBar

