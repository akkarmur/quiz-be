import { NextFunction, Request, Response } from 'express'
import { getVocabularyUseCase } from '../../../../application/usecase/vocabulary/get-vocabulary/get-vocabulary.usecase'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlVocabularyRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary.repo'

export const getVocabularyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tokenDetails = res.locals.user
    const input = req.query

    // Determine query conditions and pagination
    let isActive = false
    if (tokenDetails && tokenDetails?.role === USER_ROLES.ADMIN) {
      isActive = true
    }

    const paginationData = convertToPagination(input)

    // Fetch data from use case
    const data = await getVocabularyUseCase(
      paginationData,
      mysqlVocabularyRepo,
      isActive,
      res.locals.transaction,
    )

    handleResult(req, res, next, StatusCodes.OK, 'OK', data)
  } catch (error) {
    next(error)
  }
}
