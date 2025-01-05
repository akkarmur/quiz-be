import { NextFunction, Request, Response } from 'express'
import { deleteVocabularyUseCase } from '../../../../application/usecase/vocabulary/delete-vocabulary/delete-vocabulary.usecase'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlVocabularyRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary.repo'

export const deleteVocabularyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract the vocabulary's ID from the request query
    const id = req.query.id

    // Extract the token details object from the response locals
    const tokenDetails = res.locals.user as TokenDetails

    // Call the deleteVocabularyUseCase to delete the vocabulary
    const result = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await deleteVocabularyUseCase(
        Number(id),
        tokenDetails,
        mysqlVocabularyRepo,
        t,
      )
    })

    // Handle the result of the use case and send an appropriate response
    handleResult(
      req,
      res,
      next,
      StatusCodes.OK,
      'DATA_DELETED_SUCCESSFULLY',
      result,
    )
  } catch (error) {
    next(error)
  }
}
