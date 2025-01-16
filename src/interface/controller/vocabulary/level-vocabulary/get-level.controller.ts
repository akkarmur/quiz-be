import { NextFunction, Request, Response } from 'express'
import { getLevelUseCase } from '../../../../application/usecase/vocabulary/level-vocabulary/get-level.usecase'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlVocabularyRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary.repo'

export const getLevelController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tokenDetails = res.locals.user
    const input = req.query

    const paginationData = convertToPagination({
      ...input,
      created_by: tokenDetails?.id,
    })

    // Fetch data from use case
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await getLevelUseCase(paginationData, mysqlVocabularyRepo, t)
    })

    handleResult(req, res, next, StatusCodes.OK, 'OK', data)
  } catch (error) {
    next(error)
  }
}
