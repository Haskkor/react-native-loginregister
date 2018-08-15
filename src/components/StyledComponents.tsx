import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { platform } from '../utils/constants'
import { grid } from '../design/grid'
import { colors } from '../design/colors'

export const LoginContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: ${Dimensions.get('window').height - (platform.isIOS ? 0 : 20)}px;
  margin-left: 20px;
  margin-right: 20px;
`
LoginContainer.displayName = 'LoginContainer'

export const LoginViewPages = styled.View`
  flex: 1;
  position: absolute;
  top: 0;
  transform: translateX(${(props: { left: number }) => props.left}px);
  height: 100%;
  width: 100%;
  align-items: flex-start;
`
LoginViewPages.displayName = 'LoginViewPages'

export const ViewModalLoginPage = styled.View`
  background-color: rgba(0, 0, 0, 0.9);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const LoginButton = styled.TouchableOpacity`
  min-height: 48px;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
  margin-right: ${grid.unit * 0.625}px;
  padding: 10px 25px 10px 25px;
  justify-content: center;
  height: auto;
  width: auto;
  background-color: ${(props: { isPlain: boolean }) =>
    props.isPlain ? colors.turquoise : colors.white};
  border: 2px ${colors.turquoise};
`
LoginButton.displayName = 'LoginButton'

export const LoginButtonText = styled.Text`
  font-family: ${grid.font};
  color: ${(props: { isPlain: boolean }) =>
    props.isPlain ? colors.white : colors.turquoise};
  font-size: ${platform.isIOS ? 18 : 14}px;
`
LoginButtonText.displayName = 'LoginButtonText'

const footersStyle = `
marginLeft: 20px;
flex: .1;
justify-content: center;
`

export const LoginFooterButton = styled.TouchableOpacity`
  ${footersStyle};
`
LoginFooterButton.displayName = 'LoginFooterButton'

export const LoginFooterAvoidKeyboard = styled.KeyboardAvoidingView`
  ${footersStyle};
`
LoginFooterAvoidKeyboard.displayName = 'LoginFooterAvoidKeyboard'

export const LoginFooterButtonText = styled.Text`
  font-family: ${grid.font};
  font-weight: bold;
  font-size: ${platform.isIOS ? 18 : 16}px;
  text-decoration-line: underline;
  color: rgba(157, 163, 173, 0.8);
`
LoginFooterButtonText.displayName = 'LoginFooterButtonText'

export const LoginViewPageContent = styled.View`
  margin-left: 20px;
  margin-right: 20px;
  flex: ${(props: { shouldCenter: boolean; flexContent: number }) =>
    props.flexContent};
  width: 90%;
  align-items: ${(props: { shouldCenter: boolean; flexContent: number }) =>
    props.shouldCenter ? 'center' : 'flex-start'};
  justify-content: flex-end;
  margin-bottom: 60px;
`
LoginViewPageContent.displayName = 'LoginViewPageContent'

export const LoginPageContentTextWrap = styled.Text`
  margin-top: -10px;
  margin-bottom: 30px;
`
LoginPageContentTextWrap.displayName = 'LoginPageContentTextWrap'

export const LoginPageContentText = styled.Text`
  color: rgb(64, 82, 111);
  font-family: ${grid.font};
  font-size: ${platform.isIOS ? 22 : 18}px;
  font-weight: ${(props: { isBold: boolean }) =>
    props.isBold ? 'bold' : 'normal'};
`
LoginPageContentText.displayName = 'LoginPageContentText'

export const LoginHeaderView = styled.View`
  flex: 0.1;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
`
LoginHeaderView.displayName = 'LoginHeaderView'

export const LoginHeaderButtonNextText = styled.Text`
  color: ${(props: { isEnabled: boolean; isInvisible: boolean }) =>
    props.isEnabled
      ? colors.turquoise
      : props.isInvisible
        ? colors.white
        : 'rgb(212, 214, 218)'};
  font-size: 20px;
  font-weight: bold;
  font-family: ${grid.font};
`
LoginHeaderButtonNextText.displayName = 'LoginHeaderButtonNextText'

export const LoginFeedbackTextInputContainer = styled.View`
  margin-bottom: 15px;
  opacity: ${(props: { opacity: number; height: number }) => props.opacity};
  height: ${(props: { opacity: number; height: number }) => props.height};
`
LoginFeedbackTextInputContainer.displayName = 'LoginFeedbackTextInputContainer'

export const LoginFeedbackTextInputTextWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
  justify-content: flex-start;
  align-items: center;
`
LoginFeedbackTextInputTextWrapper.displayName =
  'LoginFeedbackTextInputTextWrapper'

export const LoginFeedbackTextInputText = styled.Text`
  font-family: ${grid.font};
  font-size: ${platform.isIOS ? 16 : 14}px;
  color: ${(props: { color: string }) => props.color};
`
LoginFeedbackTextInputText.displayName = 'LoginFeedbackTextInputText'

export const LoginTopButtonPassword = styled.View`
  padding-bottom: 30px;
`
LoginTopButtonPassword.displayName = 'LoginTopButtonPassword'

export const LoginFinishedPageText = styled.Text`
  font-family: ${grid.font};
  font-weight: ${platform.isIOS
    ? (props: { isBold: boolean }) => (props.isBold ? 'bold' : 'normal')
    : 'normal'};
  font-size: ${platform.isIOS ? 22 : 18}px;
  color: ${colors.base};
`
LoginFinishedPageText.displayName = 'LoginFinishedPageText'

export const LoginViewTextInput = styled.View`
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  width: ${Dimensions.get('window').width - 80};
  border: 0 ${(props: { colorBorder: string }) => props.colorBorder};
  border-bottom-width: 2px;
`
LoginViewTextInput.displayName = 'LoginViewTextInput'

export const LoginTextInput = styled.TextInput`
  font-size: ${platform.isIOS ? 22 : 14};
  padding-bottom: ${grid.unit * 0.625}px;
  padding-top: ${grid.unit * 0.625}px;
  font-family: ${grid.font};
  font-weight: ${platform.isIOS
    ? (props: { isEmpty: boolean; colorText: string }) =>
        props.isEmpty ? 'bold' : 'normal'
    : 'normal'};
  color: ${(props: { isEmpty: boolean; colorText: string }) => props.colorText};
  background-color: rgba(0, 0, 0, 0);
`
LoginTextInput.displayName = 'LoginTextInput'
