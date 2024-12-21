import User from '../../../infrastructure/orm/sequelize/entities/m_user'
import { IdAndCreateAndUpdateAtBy } from '../common/db-fields.interface'

/**
 * @export
 * @interface RegistrationPostReq
 */
export interface RegistrationPostReq {
  /**
   *
   * @type {string}
   * @memberof RegistrationPostReq
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof RegistrationPostReq
   */
  otp: string
  /**
   *
   * @type {string}
   * @memberof RegistrationPostReq
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof RegistrationPostReq
   */
  password: string
  /**
   *
   * @type {string}
   * @memberof RegistrationPostReq
   */
  device_id: string
  /**
   *
   * @type {string}
   * @memberof RegistrationPostReq
   */
  device_token?: string
  /**
   *
   * @type {string}
   * @memberof RegistrationPostReq
   */
  os: string
}

export type RegistrationDbData = Pick<User, 'email' | 'name' | 'password'> &
  IdAndCreateAndUpdateAtBy<User>
