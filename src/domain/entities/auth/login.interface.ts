import Login from '../../../infrastructure/orm/sequelize/entities/t_login'
import { IdAndCreateAndUpdateAtBy } from '../common/db-fields.interface'

/**
 * @export
 * @interface LoginPostReq
 */
export interface LoginPostReq {
  /**
   *
   * @type {string}
   * @memberof LoginPostReq
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof LoginPostReq
   */
  password: string
  /**
   *
   * @type {string}
   * @memberof LoginPostReq
   */
  device_id: string
  /**
   *
   * @type {string}
   * @memberof LoginPostReq
   */
  device_token?: string
  /**
   *
   * @type {string}
   * @memberof LoginPostReq
   */
  os: string
}

export interface LoginTokenDetails {
  /**
   *
   * @type {number}
   * @memberof LoginTokenDetails
   */
  id: number
  /**
   *
   * @type {string}
   * @memberof LoginTokenDetails
   */
  email: string
  /**
   *
   * @type {enum('user','admin','super_admin')}
   * @memberof LoginTokenDetails
   */
  role: string
}

export function LoginPostReqFromJSON(json: any): LoginPostReq {
  return LoginPostReqFromJSONTyped(json)
}

export type loginRes = {
  refresh_token: string
  access_token: string
}

export function LoginPostReqFromJSONTyped(json: any): LoginPostReq {
  if (json === undefined || json === null) {
    return json
  }
  return {
    email: json['email'],
    password: json['password'],
    device_id: json['device_id'],
    device_token: json['device_token'],
    os: json['os'],
  }
}

export function LoginTokenDetailsFromJSON(json: any): LoginTokenDetails {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: json['id'],
    email: json['email'],
    role: json['role'],
  }
}

export type FindLoginReq = {
  user_id?: number
  device_id: string
  refresh_token?: string
}

export type LoginDetails = Pick<Login, 'device_id' | 'is_active'> &
  IdAndCreateAndUpdateAtBy<Login> & {
    user_id?: Login['user_id']
    refresh_token?: Login['refresh_token']
    os?: Login['os']
    device_token?: Login['device_token']
  }
