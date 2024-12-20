import { NextFunction, Request, Response } from 'express'
import { updateVocabularyGroupUseCase } from '../../../../application/usecase/vocabulary-group/update-vocabulary-group/update-vocabulary-group.usecase'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlVocabularyGroupRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group.repo'

/**
 * Controller for handling vocabulary group update requests.
 * This controller extracts the request body and the token details from the response locals,
 * and then calls the updateVocabularyGroupUseCase to update the vocabulary group.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction for error handling.
 * @returns Promise<void> - A promise that resolves to void.
 */
export const updateVocabularyGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract the token details object from the response locals
    const tokenDetails = res.locals.user as TokenDetails

    // Call the use case to update the vocabulary group
    const result = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await updateVocabularyGroupUseCase(
        req.body,
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
      'DATA_UPDATED_SUCCESSFULLY',
      result,
    )
  } catch (error) {
    // Pass errors to the next middleware
    next(error)
  }
}
