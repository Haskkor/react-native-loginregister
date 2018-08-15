import * as React from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import { Animate } from 'react-move'
import { easeQuadInOut } from 'd3-ease'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { FeedbackTextInput } from './SignupLoginComponent'
import {
  LoginButton,
  LoginButtonText,
  LoginFeedbackTextInputContainer,
  LoginFeedbackTextInputText,
  LoginFeedbackTextInputTextWrapper,
  LoginFinishedPageText,
  LoginFooterAvoidKeyboard,
  LoginFooterButton,
  LoginFooterButtonText,
  LoginHeaderButtonNextText,
  LoginHeaderView,
  LoginPageContentText,
  LoginPageContentTextWrap,
  LoginTopButtonPassword,
  LoginViewPageContent,
  ViewModalLoginPage
} from './StyledComponents'
import { grid } from '../design/grid'
import { colors } from '../design/colors'
import LoginRegisterInputField from './LoginRegisterInputField'

const dim = Dimensions.get('window')

export const LoginBackground: React.SFC<{ backgroundTranslate: number }> = ({
  backgroundTranslate
}) => (
  <Animate
    show={true}
    start={{
      translate: backgroundTranslate
    }}
    update={{
      translate: [backgroundTranslate],
      timing: { duration: 400, easeQuadInOut }
    }}>
    {({ translate }: any) => (
      <Image
        style={{
          position: 'absolute',
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width * 1.3,
          transform: [{ translateX: translate * 2 }]
        }}
        source={require('../../../../assets/images/login-background.png')}
      />
    )}
  </Animate>
)
LoginBackground.displayName = 'LoginBackground'

export const LoginPageContent: React.SFC<{
  children: JSX.Element
  feedbackTextInput: FeedbackTextInput[]
  showLogo: boolean
  flexContent: number
  titleBold: string
  title: string
  hideTopSection?: boolean
  shouldCenter: boolean
}> = ({
  children,
  feedbackTextInput,
  title,
  titleBold,
  showLogo,
  hideTopSection,
  shouldCenter,
  flexContent
}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <LoginViewPageContent shouldCenter={shouldCenter} flexContent={flexContent}>
      {showLogo && (
        <Image
          style={{ resizeMode: 'contain', width: dim.width / 2 }}
          source={require('../../../../assets/images/direct-broking-logo.png')}
        />
      )}
      {!hideTopSection && (
        <LoginPageContentTextWrap>
          <LoginPageContentText isBold={true}>
            {titleBold}
            &nbsp;
          </LoginPageContentText>
          <LoginPageContentText isBold={false}>{title}</LoginPageContentText>
        </LoginPageContentTextWrap>
      )}
      {!hideTopSection && (
        <LoginFeedBackTextInput feedbackTextInput={feedbackTextInput} />
      )}
      {children}
    </LoginViewPageContent>
  </TouchableWithoutFeedback>
)

export const LoginFeedBackTextInput: React.SFC<{
  feedbackTextInput: FeedbackTextInput[]
}> = ({ feedbackTextInput }) => (
  <Animate
    show={feedbackTextInput.length > 0}
    start={{
      height: 0,
      opacity: 0
    }}
    enter={[
      {
        height: [feedbackTextInput.length * 25],
        timing: { duration: 200, easeQuadInOut }
      },
      {
        opacity: [1],
        timing: { delay: 100, duration: 300, easeQuadInOut }
      }
    ]}
    update={[
      {
        height: [feedbackTextInput.length * 25],
        timing: { duration: 200, easeQuadInOut }
      }
    ]}
    leave={{
      height: [0],
      opacity: [0],
      timing: { duration: 200, easeQuadInOut }
    }}>
    {({ height, opacity }: any) => (
      <LoginFeedbackTextInputContainer height={height} opacity={opacity}>
        {feedbackTextInput.map((fb: FeedbackTextInput) => {
          return (
            <LoginFeedbackTextInputTextWrapper key={fb.sentence}>
              <LoginFeedbackTextInputText
                color={fb.onError ? colors.orange : colors.turquoise}>
                {fb.sentence}
              </LoginFeedbackTextInputText>
              {!fb.onError && (
                <Icon
                  name="check"
                  style={{ marginLeft: 5 }}
                  size={18}
                  color={colors.turquoise}
                />
              )}
            </LoginFeedbackTextInputTextWrapper>
          )
        })}
      </LoginFeedbackTextInputContainer>
    )}
  </Animate>
)

export const LoginHeader: React.SFC<{
  isNextEnabled: boolean
  isPrevRemoved: boolean
  onPressNext: () => void
  isNextButtonRemoved: boolean
  onPressPrevious: () => void
}> = ({
  isNextEnabled,
  isPrevRemoved,
  onPressNext,
  isNextButtonRemoved,
  onPressPrevious
}) => (
  <LoginHeaderView>
    <TouchableOpacity onPress={onPressPrevious} disabled={isPrevRemoved}>
      <Icon
        name="arrow-back"
        size={28}
        color={isPrevRemoved ? colors.white : colors.turquoise}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={onPressNext} disabled={!isNextEnabled}>
      <LoginHeaderButtonNextText
        isEnabled={isNextEnabled}
        isInvisible={isNextButtonRemoved}>
        Next
      </LoginHeaderButtonNextText>
    </TouchableOpacity>
  </LoginHeaderView>
)

export const LoginFooter: React.SFC<{ onPress: () => void }> = ({
  onPress
}) => (
  <LoginFooterButton onPress={onPress}>
    <LoginFooterButtonText>Terms of Use</LoginFooterButtonText>
  </LoginFooterButton>
)

export const LoginForgetPassword: React.SFC<{ onPress: () => void }> = ({
  onPress
}) => (
  <LoginFooterAvoidKeyboard behavior={'position'}>
    <TouchableOpacity onPress={onPress}>
      <LoginFooterButtonText>I forgot my password</LoginFooterButtonText>
    </TouchableOpacity>
  </LoginFooterAvoidKeyboard>
)

export const LoginEmailForm: React.SFC<{
  email: string
  hasFeedback: boolean
  onChange: (val: string) => void
  onBlur: () => void
  isInvalid: boolean
}> = ({ email, onChange, onBlur, isInvalid, hasFeedback }) => (
  <React.Fragment>
    <LoginRegisterInputField
      type="email"
      initValue={email}
      hasFeedback={hasFeedback}
      onBlur={onBlur}
      isInvalid={isInvalid}
      onChange={(v: string) => onChange(v)}
      placeholder={'yourbestcontact@mail.com'}
    />
  </React.Fragment>
)

export const LoginPasswordForm: React.SFC<{
  onChange: (val: string) => void
  onBlur: () => void
  onChangeConfirm: (val: string) => void
  isInvalidMain: boolean
  hasFeedbackMain: boolean
  isInvalidConfirm: boolean
  hasFeedbackConfirm: boolean
}> = ({
  onChange,
  onChangeConfirm,
  onBlur,
  isInvalidMain,
  hasFeedbackMain,
  isInvalidConfirm,
  hasFeedbackConfirm
}) => (
  <React.Fragment>
    <LoginTopButtonPassword>
      <LoginRegisterInputField
        type="password"
        isInvalid={isInvalidMain}
        hasFeedback={hasFeedbackMain}
        onBlur={onBlur}
        onChange={(v: string) => onChange(v)}
        placeholder={'password'}
      />
    </LoginTopButtonPassword>
    <LoginRegisterInputField
      type="password"
      onBlur={onBlur}
      isInvalid={isInvalidConfirm}
      hasFeedback={hasFeedbackConfirm}
      onChange={(v: string) => onChangeConfirm(v)}
      placeholder={'confirm password'}
    />
  </React.Fragment>
)

export const LoginForm: React.SFC<{
  onChange: (v: string) => void
  onBlur: () => void
  showEmailField: boolean
  onChangeEmail: (v: string) => void
  isInvalid: boolean
  hasFeedback: boolean
}> = ({
  onChange,
  onBlur,
  showEmailField,
  onChangeEmail,
  isInvalid,
  hasFeedback
}) => (
  <React.Fragment>
    {showEmailField && (
      <LoginTopButtonPassword>
        <LoginRegisterInputField
          type="email"
          isInvalid={isInvalid}
          hasFeedback={hasFeedback}
          onBlur={onBlur}
          onChange={(v: string) => onChangeEmail(v)}
          placeholder={'yourbestcontact@mail.com'}
        />
      </LoginTopButtonPassword>
    )}
    <LoginRegisterInputField
      type="password"
      isInvalid={false}
      hasFeedback={false}
      onBlur={onBlur}
      onChange={(v: string) => onChange(v)}
      placeholder={'password'}
    />
  </React.Fragment>
)

export const LoginFinishedPage: React.SFC<{
  resendEmail: () => void
  changeEmail: () => void
  email: string
  isResend: boolean
}> = ({ changeEmail, resendEmail, email, isResend }) => (
  <View>
    <Text style={{ marginBottom: grid.unit * 2 }}>
      <LoginFinishedPageText isBold={false}>We </LoginFinishedPageText>
      <LoginFinishedPageText isBold={isResend}>
        {isResend ? 'resent ' : 'sent '}
      </LoginFinishedPageText>
      <LoginFinishedPageText isBold={false}>a link to </LoginFinishedPageText>
      <LoginFinishedPageText isBold={true}>{email} </LoginFinishedPageText>
      <LoginFinishedPageText isBold={false}>
        to verify your email address.
      </LoginFinishedPageText>
    </Text>
    <LoginFinishedPageText
      isBold={false}
      style={{ marginBottom: grid.unit * 4 }}>
      You'll need to click on it to continue further.
    </LoginFinishedPageText>
    <View style={{ flexDirection: 'row' }}>
      <LoginButton isPlain={true} onPress={resendEmail}>
        <LoginButtonText isPlain={true}>Resend</LoginButtonText>
      </LoginButton>
      <LoginButton isPlain={false} onPress={changeEmail}>
        <LoginButtonText isPlain={false}>Change my email</LoginButtonText>
      </LoginButton>
    </View>
  </View>
)

export const LoginConfirmedPage: React.SFC<{
  onPress: () => void
  email: string
  isResettingPassword: boolean
}> = ({ email, onPress, isResettingPassword }) => (
  <View>
    {(isResettingPassword && (
      <Text style={{ marginBottom: grid.unit * 2 }}>
        <LoginFinishedPageText isBold={true}>
          You have a new password!
        </LoginFinishedPageText>
      </Text>
    )) || (
      <Text style={{ marginBottom: grid.unit * 2 }}>
        <LoginFinishedPageText isBold={false}>
          Your email{' '}
        </LoginFinishedPageText>
        <LoginFinishedPageText isBold={true}>{email} </LoginFinishedPageText>
        <LoginFinishedPageText isBold={false}>
          has been confirmed.
        </LoginFinishedPageText>
      </Text>
    )}
    <LoginFinishedPageText
      isBold={false}
      style={{ marginBottom: grid.unit * 4 }}>
      You can continue your application.
    </LoginFinishedPageText>
    <View style={{ flexDirection: 'row' }}>
      <LoginButton isPlain={true} onPress={onPress}>
        <LoginButtonText isPlain={true}>Continue</LoginButtonText>
      </LoginButton>
    </View>
  </View>
)

export const LoginLoadingPage: React.SFC<{}> = () => (
  <Image
    style={{ width: 46, height: 25 }}
    source={require('../../../../assets/images/loader-white.gif')}
  />
)

export const LoginModal: React.SFC<{}> = () => (
  <Modal animationType={'fade'} transparent={true} visible={true}>
    <ViewModalLoginPage />
  </Modal>
)
