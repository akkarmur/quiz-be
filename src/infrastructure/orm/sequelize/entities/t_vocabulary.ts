import { DataTypes, Model } from 'sequelize'
import { sequelize } from '..'
import { ID } from './utils'

/**
 * Vocabulary model class
 *
 * @class Vocabulary
 * @extends {Model}
 */
/**
 * Represents a vocabulary word.
 *
 * @remarks
 * The t_vocabulary table contains information about each vocabulary word.
 * Each word has attributes such as language, meaning, pronunciation, notes, level, and type.
 */
class Vocabulary extends Model {
  public id!: number
  public vocab_group_id!: number
  public word!: string
  public language!: string
  public note_word!: string
  public image?: string
  public meaning!: string
  public pronunciation!: string
  public note_meaning!: string
  public level?: number
  public type?: string
  public created_at!: Date
  public created_by!: number
  public updated_at!: Date
  public updated_by?: number
}

Vocabulary.init(
  {
    id: ID,
    vocab_group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 't_vocabulary_group',
        key: 'id',
      },
    },
    word: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    note_word: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    meaning: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    pronunciation: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    note_meaning: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: null,
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
    tableName: 't_vocabulary',
    timestamps: false,
    sequelize: sequelize,
  },
)

export default Vocabulary
