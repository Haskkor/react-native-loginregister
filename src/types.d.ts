export type FeedbackTextInput = {
  sentence: string
  onError: boolean
}

export enum Auth0SessionStatus {
  email = 'email',
  password = 'password',
  login = 'login',
  finished = 'finished',
  loading = 'loading',
  confirmed = 'confirmed'
}
