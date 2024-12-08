/**
 * Represents an order field that is used in the pagination
 * @prop {string} field - The field to order by
 * @prop {'asc' | 'desc'} direction - The direction to order by
 */
export type OrderField = {
  field: string
  direction: 'asc' | 'desc'
}

export type PaginationField = {
  name: string
  value: string | number
  operation:
    | 'like'
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'less_than'
    | 'greater_than_equals'
    | 'less_than_equals'
    | string
}

/**
 * Represents the pagination object that is used in the use cases
 * @prop {PaginationField[]} fields - The fields to filter by
 * @prop {number} limit - The limit of records per page
 * @prop {number} offset - The offset of the records
 * @prop {OrderField[]} order - The order by fields
 */
export type Pagination = {
  fields?: PaginationField[]
  limit?: number
  offset?: number
  order?: OrderField[]
}

type InputOrder = string | string[]

/**
 * Represents a parsed order by object
 * @prop {string} field - The field to order by
 * @prop {'asc' | 'desc'} direction - The direction to order by
 */
interface ParsedOrder {
  field: string
  direction: 'asc' | 'desc'
}

/**
 * Parses the given order by data into an array of objects
 * @param {string|string[]} order - The order by data to parse
 * @returns {ParsedOrder[]} - An array of objects containing the parsed order by data
 */
export const parseOrder = (order: InputOrder): ParsedOrder[] => {
  /**
   * If the order by data is a string, split it by the '|' character
   * and use the first part as the field and the second part as the direction
   * If the direction is not provided, default to 'asc'
   */
  if (typeof order === 'string') {
    const [field, direction] = order.split(' | ')
    return [{ field, direction: (direction as 'asc' | 'desc') || 'asc' }]
  } else if (Array.isArray(order)) {
    /**
     * If the order by data is an array, map over each item and split it by the '|' character
     * and use the first part as the field and the second part as the direction
     * If the direction is not provided, default to 'asc'
     */
    return order.map((item) => {
      const [field, direction] = item.split(' | ')
      return { field, direction: (direction as 'asc' | 'desc') || 'asc' }
    })
  }
  /**
   * If the order by data is neither a string nor an array, return an empty array
   */
  return []
}

/**
 * Converts the given data to a pagination object
 * @param {Object} data - The data to convert
 * @returns {Pagination} - The converted pagination object
 */
export const convertToPagination = (data: any): Pagination => {
  /**
   * Destructures the given data into separate variables
   * - order: The order by fields
   * - limit: The limit of records per page
   * - offset: The offset of the records
   * - fields: The fields to filter by
   */
  const { order, limit, offset, ...fields } = data

  /**
   * Parses the order by fields into an array of objects with the
   * field name and direction
   */
  const orderFields = parseOrder(order)

  /**
   * Initializes an array to store the pagination field data
   */
  const fieldData: PaginationField[] = []

  /**
   * Loops over the fields and builds the pagination field array
   */
  Object.keys(fields).forEach((fieldName) => {
    /**
     * If the field is a number, build the pagination field data
     * with the field name, value, and operation set to 'equals'
     */
    if (typeof fields[fieldName] === 'number') {
      fieldData.push({
        name: fieldName,
        value: fields[fieldName],
        operation: 'equals',
      })
    }

    /**
     * If the field is an array, loop over it and build the pagination field array
     */
    if (Array.isArray(fields[fieldName])) {
      fields[fieldName]?.forEach((d: any) => {
        /**
         * Splits the array item into the field value and operation
         * and builds the pagination field data
         */
        fieldData.push({
          name: fieldName,
          value: d.split(' | ')[0],
          operation: d.split(' | ')[1] || 'equals',
        })
      })
    }

    /**
     * If the field is a string, build the pagination field array
     */
    if (typeof fields[fieldName] === 'string') {
      /**
       * Splits the string into the field value and operation
       * and builds the pagination field data
       */
      fieldData.push({
        name: fieldName,
        value: fields[fieldName].split(' | ')[0],
        operation: fields[fieldName].split(' | ')[1] ?? 'equals',
      })
    }
  })

  /**
   * Builds the pagination object with the parsed data
   */
  const pagination: Pagination = {
    fields: fieldData,
    order: orderFields,
    limit: limit ? parseInt(limit, 10) : undefined,
    offset: offset ? parseInt(offset, 10) : undefined,
  }

  return pagination
}
