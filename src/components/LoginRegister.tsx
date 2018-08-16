import * as React from 'react'
import {Alert, Dimensions, Keyboard, ScrollView, TouchableWithoutFeedback, View} from 'react-native'
import {Animate} from 'react-move'
import {easeQuadInOut} from 'd3-ease'
import delay from '../delay'
import * as lodash from 'lodash'
import {
  LoginBackground,
  LoginConfirmedPage,
  LoginEmailForm,
  LoginFinishedPage,
  LoginFooter,
  LoginForgetPassword,
  LoginForm,
  LoginHeader,
  LoginLoadingPage,
  LoginModal,
  LoginPageContent,
  LoginPasswordForm
} from './CustomComponents'
import {LoginContainer, LoginViewPages} from './StyledComponents'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'
import Auth0SessionStatus = ReduxState.Auth0SessionStatus
import {platform} from '../utils/constants'
import FlexibleStatusBar from './FlexibleStatusBar'
import { FeedbackTextInput } from '../types'

type IProps = {
  auth0session: ReduxState.Auth0Session
  auth0nextStep: typeof auth0NextStepStart
  auth0resetError: typeof auth0ResetError
  navigation: NavigationScreenProp<NavigationRoute<any>, NavigationAction>
  changeProcess?: (startProcess: boolean, showRoadMap: boolean, showTermsOfUse: boolean, showLogin: boolean) => void
}

const initialState = {
  email: '',
  password: '',
  passwordConfirm: '',
  backgroundTranslate: 0,
  feedbackTextInput: [] as FeedbackTextInput[],
  showModalLogin: false,
  showModalForgetPassword: false,
  showModalEmailNotVerified: false
}

type IState = typeof initialState

const orderedStatuses = [Auth0SessionStatus.email, Auth0SessionStatus.login, Auth0SessionStatus.password,
  Auth0SessionStatus.finished, Auth0SessionStatus.confirmed, Auth0SessionStatus.loading]

class LoginRegister extends React.PureComponent<IProps, IState> {
  _previousStatus: Auth0SessionStatus
  _previousStatusAnimation: Auth0SessionStatus = Auth0SessionStatus.email
  _hasBeenResent: boolean = false
  _hasHitEmailNotVerified = false
  _displayEmail: string
  _isResetting: boolean = false

  constructor(props: IProps) {
    super(props)
    this.state = initialState
    this.onPressNext = lodash.throttle(this.onPressNext, 500, {trailing: false})
    this.isDirectionRight = lodash.throttle(this.isDirectionRight, 100, {trailing: false})
    this.changePreviousStatus = lodash.throttle(this.changePreviousStatus, 500, {trailing: false})
  }

  componentDidUpdate() {
    const {user, status} = this.props.auth0session
    if (user && !user.emailVerified && !this._hasHitEmailNotVerified) {
      if (this.props.auth0session.status === Auth0SessionStatus.login && (this._previousStatus === Auth0SessionStatus.email || !this._previousStatus)
        && this.state.password.length > 0 && !this.state.showModalEmailNotVerified) this.setState({showModalEmailNotVerified: true})
    }
    if (this.props.auth0session.error && this.state.feedbackTextInput.length === 0) this.checkErrorTextInput(status)
    if ((status === Auth0SessionStatus.email && this.state.email.length === 0 && this.state.feedbackTextInput.length > 0)
      || (status === Auth0SessionStatus.login && (this.state.email.length === 0 || this.state.password.length === 0) && this.state.feedbackTextInput.length > 0)
      || (status === Auth0SessionStatus.password && this.state.password.length === 0 && this.state.passwordConfirm.length === 0 && this.state.feedbackTextInput.length > 0)) {
      this.props.auth0resetError()
      this.setState({feedbackTextInput: []})
    }
  }

  async componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.auth0session.status !== this.props.auth0session.status) {
      this._previousStatus = this.props.auth0session.status
      if (nextProps.auth0session.userExists && nextProps.auth0session.status === Auth0SessionStatus.login && !this.state.showModalLogin) {
        await delay(400)
        this.setState({showModalLogin: true})
      }
      await delay(50)
      this.changePreviousStatus(this.isDirectionRight())
    }
    if (nextProps.auth0session.user && nextProps.auth0session.user.emailVerified && nextProps.auth0session.status === Auth0SessionStatus.finished) {
      this.onPressNext(false)
    }
  }

  onPressNext = async (isGoingBack: boolean, resetPassword?: boolean, emailNotVerified?: boolean) => {
    if (isGoingBack && this.props.auth0session.status === Auth0SessionStatus.login && !this._previousStatus) {
      this.props.changeProcess(false, false, false, false)
      return
    }
    const toReset = (this.props.auth0session.status === Auth0SessionStatus.password && this._isResetting) ||
    (this.props.auth0session.status === Auth0SessionStatus.email && this._hasHitEmailNotVerified) ? true : resetPassword
    Keyboard.dismiss()
    this._hasBeenResent = resetPassword
    if (isGoingBack) this.resetFields(this.props.auth0session.status)
    this.handleResetPassword(resetPassword, isGoingBack)
    if (this._previousStatus === Auth0SessionStatus.email) this._displayEmail = this.state.email
    this.props.auth0nextStep({
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      resetPassword: toReset,
      isGoingBack,
      emailNotVerified
    })
  }

  isEmailValid = (email: string) => {
    return new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/).test(email)
  }

  isPasswordValid = (pwd: string) => {
    return pwd.length >= 8 && /[0-9]/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd)
  }

  resetFields = (status: Auth0SessionStatus) => {
    if (status === Auth0SessionStatus.password || status === Auth0SessionStatus.login) this.setState({
      email: '',
      passwordConfirm: '',
      password: ''
    })
    if (status === Auth0SessionStatus.finished) this.setState({password: '', passwordConfirm: ''})
    if (this._previousStatus) this._hasHitEmailNotVerified = false
  }

  handleResetPassword = (isResetting: boolean, isGoingBack: boolean) => {
    if (isResetting) this._isResetting = true
    else if (this._previousStatus === Auth0SessionStatus.password && isGoingBack) this._isResetting = false
  }

  isDirectionRight = (): boolean => {
    if (this.props.auth0session.status === this._previousStatusAnimation) return true
    const goingRight = orderedStatuses.indexOf(this.props.auth0session.status) > orderedStatuses.indexOf(this._previousStatusAnimation)
    return goingRight
  }

  changePreviousStatus = async (goingRight: boolean) => {
    this.setState({
      backgroundTranslate: goingRight ? this.state.backgroundTranslate - 50 : this.state.backgroundTranslate + 50,
      feedbackTextInput: []
    })
    await delay(400) // wait until the end of the animation
    this._previousStatusAnimation = this.props.auth0session.status
  }

  isNextButtonEnabled = () => {
    if (this.props.auth0session.status === Auth0SessionStatus.email) return this.isEmailValid(this.state.email)
    else if (this.props.auth0session.status === Auth0SessionStatus.login) return this.isEmailValid(this.state.email) && this.state.password.length >= 8
    else if (this.props.auth0session.status === Auth0SessionStatus.password)
      return this.isPasswordValid(this.state.password) && this.state.password === this.state.passwordConfirm
    else return false
  }

  isNextButtonRemoved = (status: Auth0SessionStatus) => status === Auth0SessionStatus.finished ||
    status === Auth0SessionStatus.loading || status === Auth0SessionStatus.confirmed

  isPrevButtonRemoved = (status: Auth0SessionStatus) => status === Auth0SessionStatus.email ||
    status === Auth0SessionStatus.confirmed || (status === Auth0SessionStatus.finished && this._hasHitEmailNotVerified)

  checkErrorTextInput = (status: Auth0SessionStatus) => {
    if (this.props.auth0session.error.includes('Network Error')) return
    switch (status) {
      case Auth0SessionStatus.email:
        if (this.state.email.length > 0) {
          this.setState({
            feedbackTextInput: [
              {
                sentence: this.isEmailValid(this.state.email) ?
                  'Email address in valid format' : 'Email address in invalid format',
                onError: !this.isEmailValid(this.state.email)
              }
            ]
          })
        }
        break
      case Auth0SessionStatus.login:
        if (this.props.auth0session.error.length > 0) {
          this.setState({
            feedbackTextInput: [
              {
                sentence: this.props.auth0session.error.includes('Wrong email or password') ? 'Wrong email or password' : 'This account has been locked',
                onError: true
              }
            ]
          })
        } else if (!!this._previousStatus && this._previousStatus !== Auth0SessionStatus.email && this._previousStatus !== Auth0SessionStatus.login) {
          this.setState({
            feedbackTextInput: [
              {
                sentence: this.isEmailValid(this.state.email) ?
                  'Email address in valid format' : 'Email address in invalid format',
                onError: !this.isEmailValid(this.state.email)
              }
            ]
          })
        }
        break
      case Auth0SessionStatus.password:
        if (this.state.passwordConfirm.length > 0 && this.isPasswordValid(this.state.password)) {
          this.setState({
            feedbackTextInput: [
              {
                sentence: this.state.password === this.state.passwordConfirm ?
                  'You\'re good to go!' : 'Password are not identical',
                onError: this.state.password !== this.state.passwordConfirm
              }
            ]
          })
        } else if (this.state.password.length > 0 || this.state.passwordConfirm.length > 0) {
          this.setState({
            feedbackTextInput: [
              {sentence: 'At least 8 characters in length', onError: this.state.password.length < 8},
              {sentence: 'Lower case letters (a-z)', onError: !(/[a-z]/.test(this.state.password))},
              {sentence: 'Upper case letters (A-Z)', onError: !(/[A-Z]/.test(this.state.password))},
              {sentence: 'Numbers (0-9)', onError: !(/[0-9]/.test(this.state.password))}
            ]
          })
        }
        break
      default:
        break
    }
  }

  isTextInputInvalid = () => this.state.feedbackTextInput.every((fb: FeedbackTextInput) => fb.onError)

  renderEmailForm = (visible: boolean) => this.renderPages((
      <LoginEmailForm email={this.state.email} onBlur={() => this.checkErrorTextInput(this.props.auth0session.status)}
                      onChange={(v) => this.setState({email: v})} isInvalid={this.isTextInputInvalid()}
                      hasFeedback={this.state.feedbackTextInput.length > 0}/>
    ), visible, this._hasHitEmailNotVerified ? 'Enter' : 'Open',
    this._hasHitEmailNotVerified ? 'your email address' : 'a new account with us', Auth0SessionStatus.email)

  renderPasswordForm = (visible: boolean) => this.renderPages((
      <LoginPasswordForm onChangeConfirm={(v) => this.setState({passwordConfirm: v})}
                         onBlur={() => this.checkErrorTextInput(this.props.auth0session.status)}
                         onChange={(v) => this.setState({password: v})}
                         isInvalidMain={!this.isPasswordValid(this.state.password)}
                         hasFeedbackMain={this.state.feedbackTextInput.length === 4}
                         isInvalidConfirm={this.state.passwordConfirm !== this.state.password}
                         hasFeedbackConfirm={this.state.feedbackTextInput.length === 1}/>
    ), visible, this._isResetting ? 'Reset' : 'Create', this._isResetting ? 'your password' : 'a secure password',
    Auth0SessionStatus.password)

  renderLoginForm = (visible: boolean) => this.renderPages((
    <LoginForm onChange={(v) => this.setState({password: v})}
               showEmailField={this._previousStatus !== Auth0SessionStatus.email && this._previousStatus !== Auth0SessionStatus.login}
               onBlur={() => this.checkErrorTextInput(this.props.auth0session.status)}
               isInvalid={this.isTextInputInvalid()}
               onChangeEmail={(v) => this.setState({email: v})} hasFeedback={this.state.feedbackTextInput.length > 0}/>
  ), visible, '', '', Auth0SessionStatus.login)

  renderFinishedPage = (visible: boolean) => this.renderPages((
    <LoginFinishedPage
      changeEmail={() => {
        this._hasHitEmailNotVerified = false
        this.setState({email: '', password: '', passwordConfirm: ''})
        this.onPressNext(false, false)
      }}
      resendEmail={() => this.onPressNext(false, true)}
      email={this._displayEmail} isResend={this._hasBeenResent}/>
  ), visible, '', '', Auth0SessionStatus.finished, true)

  renderConfirmedPage = (visible: boolean) => this.renderPages((
    <LoginConfirmedPage
      onPress={() => this.props.navigation.navigate('Questions')}
      email={this._displayEmail} isResettingPassword={this._isResetting}/>
  ), visible, '', '', Auth0SessionStatus.confirmed, true)

  renderModal = (displayAlert: () => void) => {
    displayAlert()
    return <LoginModal/>
  }

  displayAlertLoginPage = async () => {
    await delay(400)
    Alert.alert('Do you want to continue your previous application?',
      `You already started an application with ${this.state.email}. You can wipe it and start a new one from scratch.`,
      [{
        text: 'Start New', onPress: async () => {
          this._isResetting = true
          this.setState({showModalLogin: false})
          this.onPressNext(false, true)
        }
      },
        {text: 'Continue', onPress: () => this.setState({showModalLogin: false})}])
  }

  displayAlertForgotPassword = async () => {
    await delay(400)
    Alert.alert('Are you sure you want to reset your password?',
      `You will be asked to confirm by clicking on a link we will email you.`,
      [{
        text: 'Cancel', onPress: () => this.setState({showModalForgetPassword: false})
      },
        {
          text: 'Reset', onPress: () => {
            this._isResetting = true
            this.setState({showModalForgetPassword: false})
            if (this._previousStatus === Auth0SessionStatus.email) {
              this.changePreviousStatus(true)
              this.onPressNext(false, true)
            } else {
              this._hasHitEmailNotVerified = true
              this.changePreviousStatus(false)
              this.onPressNext(true)
            }
          }
        }])
  }

  displayAlertEmailNotVerified = async () => {
    await delay(400)
    Alert.alert('This email has not been verified yet.',
      `You need to verify your email address to be able to log in.`,
      [{
        text: 'Cancel', onPress: () => {
          this._hasHitEmailNotVerified = true
          this.setState({password: '', email: '', showModalEmailNotVerified: false})
          this.changePreviousStatus(true)
          this.onPressNext(false, false, false)
        }
      }, {
        text: 'Resend link', onPress: () => {
          this._hasHitEmailNotVerified = true
          this.setState({showModalEmailNotVerified: false})
          this.changePreviousStatus(true)
          this.onPressNext(false, false, true)
        }
      }])
  }

  renderLoadingPage = (visible: boolean) => this.renderPages((<LoginLoadingPage/>), visible, '', '',
    Auth0SessionStatus.loading, true)

  displayLogo = (status: Auth0SessionStatus) => status !== Auth0SessionStatus.password
    && status !== Auth0SessionStatus.finished && status !== Auth0SessionStatus.loading
    && status !== Auth0SessionStatus.confirmed

  displayHeader = (status: Auth0SessionStatus) => status !== Auth0SessionStatus.loading

  shouldCenterContentPage = (status: Auth0SessionStatus) => status === Auth0SessionStatus.loading

  displayFooter = (status: Auth0SessionStatus) => {
    if (status === Auth0SessionStatus.login)
      return <LoginForgetPassword onPress={() => this.setState({showModalForgetPassword: true})}/>
    if (status !== Auth0SessionStatus.loading) return <LoginFooter
      onPress={() => this.props.navigation.navigate('terms-of-use')}/>
    else return <View style={{flex: .1}}/>
  }

  getFlexContent = (status: Auth0SessionStatus) => {
    if (status === Auth0SessionStatus.finished || status === Auth0SessionStatus.confirmed) return .75
    return .65
  }

  getSizeEmptyView = (status: Auth0SessionStatus) => {
    if (status === Auth0SessionStatus.finished || status === Auth0SessionStatus.confirmed) return .05
    return .35
  }

  renderPages = (children: JSX.Element, visible: boolean, titleBold: string, title: string,
                 displayStatus: Auth0SessionStatus, hideTopSection?: boolean) => {
    const isGoingForward = this.isDirectionRight()
    return (
      <Animate
        show={visible}
        start={{
          translate: isGoingForward ? 500 : -500
        }}
        enter={{translate: [0], timing: {duration: 400, easeQuadInOut}}}
        leave={{translate: [isGoingForward ? -500 : 500], timing: {duration: 300, easeQuadInOut}}}>
        {({translate}: any) => (
          <LoginViewPages left={translate}>

            {this.displayHeader(displayStatus) &&
            <LoginHeader onPressNext={() => this.onPressNext(false)}
                         isNextButtonRemoved={this.isNextButtonRemoved(displayStatus)}
                         isNextEnabled={this.isNextButtonEnabled()} onPressPrevious={() => this.onPressNext(true)}
                         isPrevRemoved={this.isPrevButtonRemoved(displayStatus)}/> || <View style={{flex: .1}}/>}

            <LoginPageContent children={children} titleBold={titleBold} title={title}
                              showLogo={this.displayLogo(displayStatus)}
                              flexContent={this.getFlexContent(displayStatus)}
                              shouldCenter={this.shouldCenterContentPage(displayStatus)}
                              hideTopSection={hideTopSection} feedbackTextInput={this.state.feedbackTextInput}/>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{flex: this.getSizeEmptyView(displayStatus)}}/>
            </TouchableWithoutFeedback>

            {this.displayFooter(displayStatus)}

          </LoginViewPages>
        )}
      </Animate>
    )
  }

  render() {
    const status = this.props.auth0session.status || Auth0SessionStatus.email
    return (
      <View>

        <ScrollView scrollEnabled={!platform.isIOS} keyboardShouldPersistTaps={'handled'}>

          <LoginContainer style={{height: Dimensions.get('window').height - (platform.isIOS ? 0 : 20)}}>

            <FlexibleStatusBar/>

            <LoginBackground backgroundTranslate={this.state.backgroundTranslate}/>

            {this.renderEmailForm(status === Auth0SessionStatus.email)}

            {this.renderPasswordForm(status === Auth0SessionStatus.password)}

            {this.renderLoginForm(status === Auth0SessionStatus.login)}

            {this.renderFinishedPage(status === Auth0SessionStatus.finished)}

            {this.renderConfirmedPage(status === Auth0SessionStatus.confirmed)}

            {this.state.showModalLogin && status === Auth0SessionStatus.login && this.renderModal(this.displayAlertLoginPage)}

            {this.state.showModalForgetPassword && status === Auth0SessionStatus.login && this.renderModal(this.displayAlertForgotPassword)}

            {this.state.showModalEmailNotVerified && status === Auth0SessionStatus.login && this.renderModal(this.displayAlertEmailNotVerified)}

            {this.renderLoadingPage(status === Auth0SessionStatus.loading)}

          </LoginContainer>

        </ScrollView>

      </View>
    )
  }
}

export default LoginRegister
