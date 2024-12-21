import { DataTypes, Model } from 'sequelize'

import { sequelize } from '..'
import { ID, ModelWithActive } from './utils'

/**
 * Login model class
 *
 * @class Login
 * @extends {Model}
 */
/**
 * Represents a user login session.
 *
 * @remarks
 * The t_login table contains information about each user's login session.
 * The user_id field is a foreign key referencing the m_user table.
 * The refresh_token field is used to store the token used to refresh the user's access token.
 * The device_id field is a unique identifier of the device used to login.
 * The os field is the operating system of the device used to login.
 * The device_token field is a unique identifier of the device used to login.
 * The is_active field is used to track whether the login session is active.
 * The created_at and updated_at fields are timestamps of when the login session was created and updated.
 * The created_by and updated_by fields are used to track who created and updated the login session.
 */
class Login extends Model {
  public id!: number
  public user_id?: number
  public refresh_token?: string
  public device_id!: string
  public os!: string
  public device_token?: string
  public is_active!: boolean
  public created_at!: Date
  public created_by?: string
  public updated_at!: Date
  public updated_by?: string
}

Login.init(
  {
    id: ID,
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'm_user',
        key: 'id',
      },
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    device_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    os: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    device_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...ModelWithActive,
  },
  {
    tableName: 't_login',
    timestamps: false,
    sequelize: sequelize,
  },
)

export default Login
