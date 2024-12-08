import { env } from '../../../infrastructure/env'
import User from '../../../infrastructure/orm/sequelize/entities/m_user'

/**
 * @export
 * @interface UserGetRes
 */

/**
 * @export
 * @interface UserGetResDataInner
 */
export interface UserGetResDataInner {
  /**
   *
   * @type {number}
   * @memberof UserGetResDataInner
   */
  id: number
  /**
   *
   * @type {string}
   * @memberof UserGetResDataInner
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof UserGetResDataInner
   */
  email: string
  /**
   *
   * @type {string}
   * @memberof UserGetResDataInner
   */
  role: UserGetResDataInnerRoleEnum
  /**
   *
   * @type {string}
   * @memberof UserGetResDataInner
   */
  profile_image?: string
  /**
   *
   * @type {boolean}
   * @memberof UserGetResDataInner
   */
  is_active: boolean
  /**
   *
   * @type {Date}
   * @memberof UserGetResDataInner
   */
  created_at: Date
  /**
   *
   * @type {string}
   * @memberof UserGetResDataInner
   */
  created_by: string
  /**
   *
   * @type {Date}
   * @memberof UserGetResDataInner
   */
  updated_at: Date
  /**
   *
   * @type {string}
   * @memberof UserGetResDataInner
   */
  updated_by: string
}

export type UserGetDB = Pick<
  User,
  | 'id'
  | 'name'
  | 'email'
  | 'profile_image'
  | 'role'
  | 'is_active'
  | 'created_at'
  | 'updated_at'
>

/**
 * @export
 */
export const UserGetResDataInnerRoleEnum = {
  User: 'user',
  Admin: 'admin',
  SuperAdmin: 'super_admin',
} as const
export type UserGetResDataInnerRoleEnum =
  (typeof UserGetResDataInnerRoleEnum)[keyof typeof UserGetResDataInnerRoleEnum]

/**
 * Converts a JSON object to a UserGetResDataInner object
 *
 * @param {any} json - The JSON object to convert
 * @param {boolean} [isActive] - Whether to include the is_active field in the converted object
 * @returns {UserGetResDataInner} - The converted UserGetResDataInner object
 */
export function UserGetResDataInnerFromJSON(
  json: any,
  isActive?: boolean,
): UserGetResDataInner {
  /**
   * This function calls the UserGetResDataInnerFromJSONTyped function
   * which does the actual conversion. The reason for having this
   * separate function is to allow the caller to pass in the isActive
   * flag. If the caller does not pass in the isActive flag,
   * then the is_active field is not included in the converted object.
   */
  return UserGetResDataInnerFromJSONTyped(json, isActive)
}

export function UserGetResDataInnerFromJSONTyped(
  json: any,
  isActive?: boolean,
): UserGetResDataInner {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: json['id'],
    name: json['name'],
    email: json['email'],
    role: json['role'],
    profile_image:
      json['profile_image'] && env.IMG_BASE_URL + json['profile_image'],
    is_active: isActive ? json['is_active'] : undefined,
    created_at: new Date(json['created_at']),
    created_by: json['created_by'],
    updated_at: new Date(json['updated_at']),
    updated_by: json['updated_by'],
  }
}

export interface UserGetRes {
  /**
   *
   * @type {number}
   * @memberof UserGetRes
   */
  totalCount: number
  /**
   *
   * @type {Array<UserGetResDataInner>}
   * @memberof UserGetRes
   */
  data: Array<UserGetResDataInner>
}
