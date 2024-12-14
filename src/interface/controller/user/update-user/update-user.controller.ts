import { NextFunction, Request, Response } from 'express'
import { updateUserUseCase } from '../../../../application/usecase/user/update-user.usecase'
import { UserPatchReq } from '../../../../domain/entities/user/user-update.interface'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo'

/**
 * Controller for handling user update requests.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function for error handling.
 * @returns {Promise<void>} - A promise representing the asynchronous execution of the controller logic.
 */
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    /**
     * Extract and preprocess input data from the request.
     */
    const id = res.locals.user.id
    const userInput: UserPatchReq = {
      id,
      ...req.body,
      image: req.file,
      updated_by: id,
    }

    /**
     * Execute the user update use case within a database transaction.
     */
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return updateUserUseCase(mysqlUserRepo, userInput, t)
    })
    /**
     * Handle the result of the use case and send an appropriate response.
     */
    handleResult(
      req,
      res,
      next,
      StatusCodes.OK,
      'DATA_UPDATED_SUCCESSFULLY',
      data,
    )
  } catch (error) {
    next(error)
  }
}
