/// <reference path='./src/types.d.ts'/>
import * as React from 'react'
import { View } from 'react-native'

export type IProps = {
}

export type IState = {
}

class LoginRegister extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
  }

  render() {
    return (
      <View/>
    )
  }
}

export default LoginRegister
