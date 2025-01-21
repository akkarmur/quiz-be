import { NextFunction, Request, Response } from 'express'
import { getVocabularyGroupUseCase } from '../../../../application/usecase/vocabulary-group/get-vocabulary-group/get-vocabulary-group.usecase'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlVocabularyGroupRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group.repo'

/**
 * Controller for handling vocabulary group retrieval requests.
 * This controller extracts the query parameters and user role from the request,
 * then fetches the vocabulary group data based on the user's role and query settings.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction for error handling.
 * @returns Promise<void> - A promise that resolves to void.
 */
export const getVocabularyGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tokenDetails: TokenDetails | undefined = res.locals.user
    const { get_all, is_public, ...query } = req.query

    // Determine query conditions and pagination
    // Determine if only user's own data should be fetched or all active data
    let isActive = false
    if (tokenDetails?.role === USER_ROLES.ADMIN) {
      // If the user is an ADMIN, fetch all active data
      isActive = true
    }

    const paginationData = convertToPagination({
      ...query,
      is_public: is_public === 'true',
      created_by: tokenDetails?.id,
    })

    // Fetch data from use case
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await getVocabularyGroupUseCase(
        paginationData,
        mysqlVocabularyGroupRepo,
        isActive,
        t,
      )
    })

    // Handle the result and send an appropriate response
    handleResult(req, res, next, StatusCodes.OK, 'OK', data)
  } catch (error) {
    // Pass errors to the next middleware
    next(error)
  }
}
