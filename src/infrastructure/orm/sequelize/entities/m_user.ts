import { DataTypes, Model } from 'sequelize'

import { USER_ROLES } from '../../../configs/constants/enums'
import { sequelize } from '..'
import { ID, ModelWithActiveArchive } from './utils'

/**
 * User model class
 *
 * @class User
 * @extends {Model}
 */
class User extends Model {
  /**
   * User id
   *
   * @type {number}
   * @memberof User
   */
  public id?: number

  /**
   * User name
   *
   * @type {string}
   * @memberof User
   */
  public name!: string

  /**
   * User email
   *
   * @type {string}
   * @memberof User
   */
  public email!: string

  /**
   * Is user logged in via Google SSO
   *
   * @type {boolean}
   * @memberof User
   */
  public google_sso!: boolean

  /**
   * User password
   *
   * @type {string}
   * @memberof User
   */
  public password?: string // Optional if google_sso is true

  /**
   * User profile image
   *
   * @type {string}
   * @memberof User
   */
  public profile_image?: string

  /**
   * User role
   *
   * @type {(USER_ROLES.USER | USER_ROLES.ADMIN | USER_ROLES.SUPER_ADMIN)}
   * @memberof User
   */
  public role?: USER_ROLES.USER | USER_ROLES.ADMIN | USER_ROLES.SUPER_ADMIN

  /**
   * Is user active
   *
   * @type {number}
   * @memberof User
   */
  public is_active!: number

  /**
   * Is user archived
   *
   * @type {number}
   * @memberof User
   */
  public is_archive!: number

  /**
   * User created at
   *
   * @type {Date}
   * @memberof User
   */
  public created_at!: Date

  /**
   * User created by
   *
   * @type {string}
   * @memberof User
   */
  public created_by!: string

  /**
   * User updated at
   *
   * @type {Date}
   * @memberof User
   */
  public updated_at!: Date

  /**
   * User updated by
   *
   * @type {(string | undefined)}
   * @memberof User
   */
  public updated_by?: string
}

User.init(
  {
    id: ID,
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    google_sso: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // Optional
      /**
       * TODO
       * add validation
       */
      // validate: {
      //   isOptionalOrSSO(value: string): void {
      //     if (!value && !this.google_sso) {
      //       throw new Error('');
      //     }
      //   },
      // },
    },
    profile_image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(
        USER_ROLES.USER,
        USER_ROLES.ADMIN,
        USER_ROLES.SUPER_ADMIN,
      ),
      allowNull: false,
      defaultValue: USER_ROLES.USER,
    },
    ...ModelWithActiveArchive,
  },
  {
    tableName: 'm_user',
    timestamps: false,
    sequelize: sequelize,
  },
)

export default User
