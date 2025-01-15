import { NextFunction, Request, Response } from 'express'
import { getQuizUseCase } from '../../../application/usecase/quiz/get/quiz.usecase'
import { convertToPagination } from '../../../domain/entities/common/pagination'
import { QUIZ_TYPE } from '../../../infrastructure/configs/constants/enums'
import { StatusCodes } from '../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlVocabularyRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary.repo'

export const getQuizController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tokenDetails = res.locals.user
    const { quiz_type, ...input } = req.query

    const paginationData = convertToPagination({
      ...input,
      created_by: tokenDetails?.id,
    })

    // Fetch data from use case
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await getQuizUseCase(
        paginationData,
        quiz_type as QUIZ_TYPE,
        mysqlVocabularyRepo,
        t,
      )
    })

    handleResult(req, res, next, StatusCodes.OK, 'OK', data)
  } catch (error) {
    next(error)
  }
}
