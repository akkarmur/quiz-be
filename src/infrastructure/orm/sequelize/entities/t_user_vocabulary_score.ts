import { DataTypes, Model } from 'sequelize'
import { sequelize } from '..'
import Vocabulary from './t_vocabulary'

/**
 * UserVocabularyScore model class
 *
 * @class UserVocabularyScore
 * @extends {Model}
 */
/**
 * Represents a user's vocabulary score.
 *
 * @remarks
 * The t_user_vocabulary_score table tracks the user's attempts and corrections for a specific vocabulary word.
 */
class UserVocabularyScore extends Model {
  public vocab_id!: number
  public attempt_count!: number
  public correct_count!: number
  public is_active!: boolean
  public created_at!: Date
  public created_by!: number
  public updated_at!: Date
  public updated_by?: number
}

UserVocabularyScore.init(
  {
    vocab_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Vocabulary,
        key: 'id',
      },
    },
    attempt_count: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    correct_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'm_user',
        key: 'id',
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: 't_user_vocabulary_score',
    timestamps: false,
    sequelize: sequelize,
  },
)

export default UserVocabularyScore
