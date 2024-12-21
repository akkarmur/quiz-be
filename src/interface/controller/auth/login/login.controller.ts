import { NextFunction, Request, Response } from 'express'

import { loginUseCase } from '../../../../application/usecase/auth/login/login.usecase'
import { LoginPostReq } from '../../../../domain/entities/auth/login.interface'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo'

/**
 * Controller for handling login requests
 * This controller takes in a request and response,
 * uses the login use case to authenticate the user,
 * and returns a response with the result of the use case
 * @param req The request object
 * @param res The response object
 * @param next The next function to call in the middleware
 * @returns A promise that resolves when the use case is finished
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: LoginPostReq = req.body

    /**
     * Passing data to usecase
     */
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await loginUseCase(input, mysqlUserRepo, mysqlAuthRepo, t)
    })

    /**
     * Returning result of the use case in the response
     */
    handleResult(req, res, next, StatusCodes.OK, 'LOGIN_SUCCESSFUL', data)
  } catch (error) {
    next(error)
  }
}
