import { NextFunction, Request, Response } from 'express'

import { refreshTokenUseCase } from '../../../application/usecase/auth/refresh-token.usecase'
import { StatusCodes } from '../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo'

/**
 * Handles the refresh token endpoint
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    /**
     * Get the token details from the request object
     */
    const token_details = res.locals.user

    /**
     * Create the input data for the usecase
     */
    const input = {
      device_id: req.body.device_id as string,
      user_id: token_details.id,
      refresh_token: (req.headers['authorization'] as string)?.replace(
        'Bearer ',
        '',
      ),
    }

    /**
     * Use the usecase to get the new access and refresh tokens
     */
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await refreshTokenUseCase(input, mysqlAuthRepo, mysqlUserRepo, t)
    })

    /**
     * Return the new access and refresh tokens
     */
    handleResult(req, res, next, StatusCodes.OK, 'OK', data)
  } catch (error) {
    next(error)
  }
}
