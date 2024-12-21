import { NextFunction, Request, Response } from 'express'
import { registrationUseCase } from '../../../../application/usecase/auth/registration/registration.usecase'
import { RegistrationPostReq } from '../../../../domain/entities/auth/registration.interface'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'
import { mysqlUserRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user.repo'

/**
 * Handles user registration requests.
 * This controller receives registration data from the request body,
 * invokes the registration use case, and returns the result.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
export const registrationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract registration input from the request body
    const input: RegistrationPostReq = req.body

    /**
     * Execute the registration use case within a transactional context.
     * The use case will handle creating a new user, issuing tokens, and
     * saving necessary details to the database.
     */
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await registrationUseCase(input, mysqlAuthRepo, mysqlUserRepo, t)
    })

    // Send a successful registration response
    handleResult(
      req,
      res,
      next,
      StatusCodes.CREATED,
      'REGISTERED_SUCCESSFULLY',
      data,
    )
  } catch (error) {
    // Pass any errors to the next middleware for handling
    next(error)
  }
}
