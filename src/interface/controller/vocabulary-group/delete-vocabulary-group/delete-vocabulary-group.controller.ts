import { NextFunction, Request, Response } from 'express'
import { deleteVocabularyGroupUseCase } from '../../../../application/usecase/vocabulary-group/delete-vocabulary-group/delete-vocabulary-group.usecase'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlVocabularyGroupRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group.repo'

/**
 * Controller for handling vocabulary group deletion requests.
 * This controller extracts the vocabulary group's ID from the request query
 * and a token details object from the response locals.
 * It then calls the deleteVocabularyGroupUseCase to delete the vocabulary group and
 * handles the result of the use case.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction for error handling.
 * @returns Promise<void> - A promise that resolves to void.
 */
export const deleteVocabularyGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract the vocabulary group's ID from the request query
    const id = req.query.id

    // Extract the token details object from the response locals
    const tokenDetails = res.locals.user as TokenDetails

    // Call the deleteVocabularyGroupUseCase to delete the vocabulary group
    const result = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await deleteVocabularyGroupUseCase(
        Number(id),
        tokenDetails,
        mysqlVocabularyGroupRepo,
        t,
      )
    })

    // Handle the result of the use case and send an appropriate response
    handleResult(
      req,
      res,
      next,
      StatusCodes.CREATED,
      'DATA_DELETED_SUCCESSFULLY',
      result,
    )
  } catch (error) {
    // Pass errors to the next middleware
    next(error)
  }
}
