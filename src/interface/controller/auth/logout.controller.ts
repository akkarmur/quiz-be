import { NextFunction, Request, Response } from 'express'

import { logoutUseCase } from '../../../application/usecase/auth/logout/logout.usecase'
import { StatusCodes } from '../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'

/**
 * Handles the logout request by removing the refresh token
 * from the database for the corresponding user and device.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express NextFunction.
 * @returns {Promise<void>} - Returns a promise that resolves when
 * the logout request has been processed.
 */
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    /**
     * Get the token details that are stored in the request.
     * This is done by using the res.locals.user object that
     * contains the user details.
     */
    const token_details = res.locals.user

    /**
     * Create an object that contains the data required to
     * pass to the logoutUseCase. The object contains the
     * user_id and device_id.
     */
    const query = {
      device_id: req.body.device_id as string,
      user_id: token_details.id,
    }

    /**
     * Wrap the logoutUseCase in a transaction using the
     * mysqlCommonRepo. This will ensure that the logout
     * request is processed atomically.
     */
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await logoutUseCase(query, mysqlAuthRepo, t)
    })

    /**
     * Return the result of the logoutUseCase to the client
     * using the handleResult function. The status code
     * is set to 200 and the message is set to 'LOGOUT_SUCCESSFUL'.
     */
    handleResult(req, res, next, StatusCodes.OK, 'LOGOUT_SUCCESSFUL', data)
  } catch (error) {
    next(error)
  }
}
