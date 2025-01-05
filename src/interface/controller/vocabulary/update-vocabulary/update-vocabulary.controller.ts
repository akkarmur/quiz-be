import { NextFunction, Request, Response } from 'express'
import { updateVocabularyUseCase } from '../../../../application/usecase/vocabulary/update-vocabulary/update-vocabulary.usecase'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlVocabularyRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary.repo'

export const updateVocabularyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tokenDetails = res.locals.user as TokenDetails
    const image = req.file as Express.Multer.File
    const input = {
      ...req.body,
      image,
      updated_by: tokenDetails.id,
    }
    const result = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await updateVocabularyUseCase(
        input,
        tokenDetails.role,
        mysqlVocabularyRepo,
        t,
      )
    })
    handleResult(req, res, next, StatusCodes.OK, 'OK', result)
  } catch (error) {
    // Pass errors to the next middleware
    next(error)
  }
}
