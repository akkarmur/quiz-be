import { NextFunction, Request, Response } from 'express'
import { insertVocabularyUseCase } from '../../../../application/usecase/vocabulary/insert-vocabulary/insert-vocabulary.usecase'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlVocabularyGroupRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group.repo'
import { mysqlVocabularyRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary.repo'

export const insertVocabularyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tokenDetails = res.locals.user as TokenDetails
    const result = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await insertVocabularyUseCase(
        req.body,
        tokenDetails,
        mysqlVocabularyRepo,
        mysqlVocabularyGroupRepo,
        t,
      )
    })
    handleResult(req, res, next, StatusCodes.CREATED, 'CREATED', result)
  } catch (error) {
    // Pass errors to the next middleware
    next(error)
  }
}
