import { NextFunction, Request, Response } from 'express'

import { getUserUseCase } from '../../../application/usecase/user/get-user.usecase'
import {
  convertToPagination,
  Pagination,
} from '../../../domain/entities/common/pagination'
import { USER_ROLES } from '../../../infrastructure/configs/constants/enums'
import { StatusCodes } from '../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo'

/**
 * Controller for handling user retrieval requests.
 * This controller extracts user role and query parameters,
 * then fetches user data based on the user's role and query settings.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction for error handling.
 * @returns Promise<void> - A promise that resolves to void.
 */
export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract token details saved in response by middleware
    const tokenDetails = res.locals.user
    const { get_all, ...query } = req.query

    // Determine if only user's own data should be fetched or all active data
    let isActive = false
    if (tokenDetails.role === USER_ROLES.USER) {
      query.id = `${tokenDetails.id}`
    } else if (get_all !== 'true') {
      query.id = `${tokenDetails.id}`
    } else {
      isActive = true
    }

    // Convert query data for pagination purposes
    const paginationData: Pagination = convertToPagination(query)

    // Execute the getUserUseCase within a database transaction
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await getUserUseCase(paginationData, mysqlUserRepo, isActive, t)
    })

    // Handle the result and send an appropriate response
    handleResult(
      req,
      res,
      next,
      StatusCodes.OK,
      'GET_USER_DETAILS_SUCCESS',
      data,
    )
  } catch (error) {
    // Pass errors to the next middleware
    next(error)
  }
}
