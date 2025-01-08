import { NextFunction, Request, Response } from 'express'
import { putUserVocabularyScoreUseCase } from '../../../../application/usecase/user-vocabulary-score/put-user-vocabulary-score/put-user-vocabulary-score.usecase'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { UserVocabularyScorePutReqInner } from '../../../../domain/entities/user-vocabulary-score/put-user-vocabulary-score.interface'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserVocabularyScoreRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user-vocab-score/user-vocabulary-score.repo'

export const putUserVocabularyScoreController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tokenDetails = res.locals.user as TokenDetails
    const input: UserVocabularyScorePutReqInner = {
      ...req.body,
      created_by: tokenDetails.id,
    }
    const result = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await putUserVocabularyScoreUseCase(
        input,
        mysqlUserVocabularyScoreRepo,
        t,
      )
    })
    handleResult(req, res, next, StatusCodes.CREATED, 'CREATED', result)
  } catch (error) {
    // Pass errors to the next middleware
    next(error)
  }
}
