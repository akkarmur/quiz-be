import { NextFunction, Request, Response } from 'express'
import { insertVocabularyGroupUseCase } from '../../../../application/usecase/vocabulary-group/insert-vocabulary-group/insert-vocabulary-group.usecase'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlVocabularyGroupRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group.repo'

/**
 * Controller for handling vocabulary group insertion requests.
 * This controller extracts the request body, verifies the provided
 * data, and then invokes the insertVocabularyGroupUseCase to insert
 * the vocabulary group.
 *
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction for error handling.
 * @returns Promise<void> - A promise that resolves to void.
 */
export const insertVocabularyGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract the request body
    const tokenDetails = res.locals.user as TokenDetails
    const result = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      // Call the use case to insert the vocabulary group
      return await insertVocabularyGroupUseCase(
        { ...req.body, created_by: tokenDetails.id },
        mysqlVocabularyGroupRepo,
        t,
      )
    })
    // Handle the result of the use case and send an appropriate response
    handleResult(req, res, next, StatusCodes.CREATED, 'CREATED', result)
  } catch (error) {
    // Pass errors to the next middleware
    next(error)
  }
}
