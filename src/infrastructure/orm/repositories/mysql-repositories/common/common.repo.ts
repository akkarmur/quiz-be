import { Op, Transaction, WhereOptions } from 'sequelize'

import {
  OrderField,
  PaginationField,
} from '../../../../../domain/entities/common/pagination'
import { wrapInTransaction } from '../../../sequelize'
import { CommonRepoInterface } from './common-repo.interface'

export const mysqlCommonRepo: CommonRepoInterface<Transaction> = {
  wrapInWorkUnitCtx: wrapInTransaction,
  /**
   * Converts an array of OrderField objects into a format suitable for ordering in SQL queries.
   *
   * @param order - An optional array of OrderField objects, each containing a field and direction ('asc' or 'desc').
   * @returns An array of tuples, where each tuple contains a field name and an order direction, or undefined if no order is provided.
   */
  convertOrder: (
    order?: OrderField[],
  ): [string, 'asc' | 'desc'][] | undefined => {
    return order ? order.map((item) => [item.field, item.direction]) : undefined
  },

  /**
   * Converts an array of PaginationField objects into a format suitable for querying in SQL queries.
   *
   * @param fields - An optional array of PaginationField objects, each containing a field, value, and operation.
   * @param active - An optional filter for the 'is_active' field. Defaults to 'active', or 'active' if not provided.
   * @returns A Sequelize WhereOptions object.
   */
  whereCondition: (
    fields?: PaginationField[],
    active?: 'active' | 'inactive' | 'both' | 'skip',
  ): WhereOptions => {
    const where: WhereOptions = {}

    if (fields && fields.length > 0) {
      // Iterate over the fields and add conditions to the where object.
      fields.forEach((field) => {
        switch (field.operation) {
          case 'like':
            // If a where condition already exists for this field, add an OR condition to the existing condition.
            if (where[field.name]) {
              where[field.name] = {
                [Op.or]: [where[field.name], { [Op.like]: `%${field.value}%` }],
              }
            } else {
              // Otherwise, create a new condition that matches the value.
              where[field.name] = { [Op.like]: `%${field.value}%` }
            }
            break
          case 'not_equals':
            // If a where condition already exists for this field, add a NOT EQUALS condition to the existing condition.
            if (where[field.name]) {
              where[field.name] = { ...where[field.name], [Op.ne]: field.value }
            } else {
              // Otherwise, create a new condition that does not match the value.
              where[field.name] = { [Op.ne]: field.value }
            }
            break
          case 'greater_than':
            // If a where condition already exists for this field, add a GREATER THAN condition to the existing condition.
            if (where[field.name]) {
              where[field.name] = { ...where[field.name], [Op.gt]: field.value }
            } else {
              // Otherwise, create a new condition that matches the value.
              where[field.name] = { [Op.gt]: field.value }
            }
            break
          case 'less_than':
            // If a where condition already exists for this field, add a LESS THAN condition to the existing condition.
            if (where[field.name]) {
              where[field.name] = { ...where[field.name], [Op.lt]: field.value }
            } else {
              // Otherwise, create a new condition that matches the value.
              where[field.name] = { [Op.lt]: field.value }
            }
            break
          case 'greater_than_equals':
            // If a where condition already exists for this field, add a GREATER THAN OR EQUALS condition to the existing condition.
            if (where[field.name]) {
              where[field.name] = {
                ...where[field.name],
                [Op.gte]: field.value,
              }
            } else {
              // Otherwise, create a new condition that matches the value.
              where[field.name] = { [Op.gte]: field.value }
            }
            break
          case 'less_than_equals':
            // If a where condition already exists for this field, add a LESS THAN OR EQUALS condition to the existing condition.
            if (where[field.name]) {
              where[field.name] = {
                ...where[field.name],
                [Op.lte]: field.value,
              }
            } else {
              // Otherwise, create a new condition that matches the value.
              where[field.name] = { [Op.lte]: field.value }
            }
            break
          default:
            // If no operation is specified, add an EQUALS condition to the existing condition.
            if (where[field.name]) {
              where[field.name] = {
                [Op.or]: [where[field.name], { [Op.eq]: field.value }],
              }
            } else {
              // Otherwise, create a new condition that matches the value.
              where[field.name] = { [Op.eq]: field.value }
            }
            break
        }
      })
    }

    // If an active filter is provided, add a condition to the where object to filter by the is_active field.
    if (active === undefined || active === 'active') {
      where['is_active'] = {
        [Op.eq]: 1,
      }
    } else if (active === 'inactive') {
      where['is_active'] = {
        [Op.eq]: 0,
      }
    }

    return where
  },
}

export const operationMap: Record<string, string> = {
  greater_than: '>',
  less_than: '<',
  greater_than_equals: '>=',
  less_than_equals: '<=',
}
