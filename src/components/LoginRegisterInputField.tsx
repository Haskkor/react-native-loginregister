import * as React from 'react'
import { Animate } from 'react-move'
import { easeQuadInOut } from 'd3-ease'
import { colors } from '../design/colors'
import { LoginTextInput, LoginViewTextInput } from './StyledComponents'

type IProps = {
  type: 'email' | 'password'
  placeholder?: string
  initValue?: string
  autoFocus?: boolean
  onChange: (value: string) => void
  onBlur: () => void
  isInvalid: boolean
  hasFeedback: boolean
}

type IState = {
  text: string
}

class LoginRegisterInputField extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { text: '' }
  }

  render() {
    const { isInvalid, hasFeedback } = this.props
    return (
      <Animate
        show={true}
        start={{
          colorText: colors.base,
          colorBorder: 'rgba(157, 163, 173, 0.8)'
        }}
        update={{
          colorText:
            isInvalid && hasFeedback
              ? colors.orange
              : hasFeedback
                ? colors.turquoise
                : colors.base,
          colorBorder:
            isInvalid && hasFeedback
              ? colors.orange
              : hasFeedback
                ? colors.turquoise
                : this.state.text.length > 0
                  ? colors.base
                  : 'rgba(157, 163, 173, 0.8)',
          timing: { duration: 200, easeQuadInOut }
        }}>
        {({ colorText, colorBorder }: any) => (
          <LoginViewTextInput colorBorder={colorBorder}>
            <LoginTextInput
              isEmpty={this.state.text.length === 0}
              autoFocus={this.props.autoFocus || false}
              testID={'AuthInputField'}
              editable={true}
              colorText={colorText}
              blurOnSubmit={true}
              multiline={false}
              onBlur={this.props.onBlur}
              value={this.state.text}
              defaultValue={this.props.initValue}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              autoCapitalize={'none'}
              placeholder={this.props.placeholder || ''}
              onChangeText={(val: string) => {
                this.setState({ text: val })
                this.props.onChange(val)
              }}
              clearTextOnFocus={false}
              secureTextEntry={this.props.type === 'password'}
              keyboardType={
                this.props.type === 'email' ? 'email-address' : 'default'
              }
              enablesReturnKeyAutomatically={true}
            />
          </LoginViewTextInput>
        )}
      </Animate>
    )
  }
}

export default LoginRegisterInputField
