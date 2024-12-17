import { DataTypes, Model } from 'sequelize'
import { sequelize } from '..'
import { ID } from './utils'

class VocabularyGroup extends Model {
  public id!: number
  public name!: string
  public description!: string
  public created_at!: Date
  public created_by!: number
  public updated_at!: Date
  public updated_by?: number
}

VocabularyGroup.init(
  {
    id: ID,
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: 't_vocabulary_group',
    timestamps: false,
    sequelize: sequelize,
  },
)

export { VocabularyGroup }
