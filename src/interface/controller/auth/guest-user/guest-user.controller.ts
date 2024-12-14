import { NextFunction, Request, Response } from 'express'
import { guestUserUseCase } from '../../../../application/usecase/auth/guest-user/guest-user.usecase'
import { GuestUserRegistrationPostReq } from '../../../../domain/entities/user/guest-user-put.interface'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'

/**
 * Guest user registration controller
 * This controller is responsible for registering or updating a guest user.
 * If the user ID is provided in the request, the controller will update the existing
 * guest user's login details. Otherwise, the controller will create a new guest
 * user.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction object.
 */
export const guestUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    /**
     * Get the input data from the request body.
     */
    const input: GuestUserRegistrationPostReq = req.body

    /**
     * Get the user ID from the request, if it exists.
     */
    const userId = res.locals?.user?.id

    /**
     * Pass the input data to the use case and wrap it in a transaction.
     */
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await guestUserUseCase(input, mysqlAuthRepo, t, userId)
    })

    /**
     * Handle the result of the use case and return the response to the client.
     */
    handleResult(req, res, next, StatusCodes.CREATED, 'CREATED', data)
  } catch (error) {
    next(error)
  }
}
