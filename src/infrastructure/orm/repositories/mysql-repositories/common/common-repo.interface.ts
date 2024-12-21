import { WhereOptions } from 'sequelize'

import {
  OrderField,
  PaginationField,
} from '../../../../../domain/entities/common/pagination'

/**
 * Interface representing common repository operations.
 */
export type CommonRepoInterface<WorkUnitCtx> = {
  /**
   * Wraps a function execution within a work unit context.
   * @param fn The function to execute within the work unit context.
   * @returns A promise that resolves with the return value of the function.
   */
  wrapInWorkUnitCtx: <X>(
    fn: (workUnitCtx: WorkUnitCtx) => Promise<X>,
  ) => Promise<X>

  /**
   * Converts an array of order fields into a format suitable for query ordering.
   * @param order The order fields to convert.
   * @returns An array of tuples containing the field name and order direction, or undefined.
   */
  convertOrder: (order?: OrderField[]) => [string, 'asc' | 'desc'][] | undefined

  /**
   * Generates where conditions for querying based on pagination fields and active status.
   * @param fields The pagination fields to use in the where condition.
   * @param active The active status filter ('active', 'inactive', or 'both').
   * @returns The where options for querying.
   */
  whereCondition: (
    fields?: PaginationField[],
    active?: 'active' | 'inactive' | 'both',
  ) => WhereOptions
}
