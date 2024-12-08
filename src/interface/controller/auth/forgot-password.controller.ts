import { NextFunction, Request, Response } from 'express'

import { forgotPasswordUseCase } from '../../../application/usecase/auth/forgot-password.usecase'
import { ForgotPasswordPatchReq } from '../../../domain/entities/auth/forgot-password.interface'
import { StatusCodes } from '../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo'

/**
 * Forgot Password Controller
 * @param req The express request object
 * @param res The express response object
 * @param next The express next function
 */
export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: ForgotPasswordPatchReq = req.body

    /**
     * Passing data to usecase
     * The usecase will verify the provided OTP and update the user's password
     * if the OTP is valid
     */
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await forgotPasswordUseCase(input, mysqlAuthRepo, mysqlUserRepo, t)
    })

    /**
     * Returning the result of the usecase
     * If the usecase returns an error, the error will be handled by the handleResult function
     * if the usecase returns a value, the value will be returned to the client
     */
    handleResult(
      req,
      res,
      next,
      StatusCodes.OK,
      'PASSWORD_RESET_SUCCESSFULLY',
      data,
    )
  } catch (error) {
    next(error)
  }
}
