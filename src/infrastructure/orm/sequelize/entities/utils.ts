import { DataTypes } from 'sequelize'

export const ModelWithCreateTime = {
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  created_by: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_by: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
}

export const ID = {
  type: DataTypes.BIGINT,
  primaryKey: true,
  autoIncrement: true,
}

export const DEFAULT = {
  type: DataTypes.TINYINT,
  allowNull: false,
  defaultValue: 0,
}

export const ModelWithActive = {
  is_active: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
  },
  ...ModelWithCreateTime,
}

export const ModelWithActiveArchive = {
  is_archive: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  ...ModelWithActive,
}
