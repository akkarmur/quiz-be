import { HttpError } from '../commonDomains/HttpError'

export type ApplicationError = HttpError

/**
 * Success tags for application responses
 */
export type SuccessTag =
  | 'OK'
  | 'CREATED'
  | 'OTP_SENT_SUCCESSFULLY'
  | 'REGISTERED_SUCCESSFULLY'
  | 'LOGOUT_SUCCESSFUL'
  | 'LOGIN_SUCCESSFUL'
  | 'PASSWORD_RESET_SUCCESSFULLY'
  | 'GET_USER_DETAILS_SUCCESS'
  | 'DATA_DELETED_SUCCESSFULLY'
  | 'DATA_UPDATED_SUCCESSFULLY'
  | 'DATA_RESTORED_SUCCESSFULLY'
