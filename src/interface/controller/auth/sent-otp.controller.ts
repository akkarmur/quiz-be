import { NextFunction, Request, Response } from 'express'

import { sentOtpUseCase } from '../../../application/usecase/auth/sent-otp.usecase'
import { SentOtpPostReqOtp } from '../../../domain/entities/auth/sent-otp.interface'
import { StatusCodes } from '../../../infrastructure/configs/constants/statusCodes'
import { handleResult } from '../../../infrastructure/helpers/res'
import { mysqlAuthRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/auth/auth.repo'
import { mysqlCommonRepo } from '../../../infrastructure/orm/repositories/mysql-repositories/common/common.repo'

/**
 * Sent OTP Controller
 * This function handles the request for sending OTP to a user.
 * First, it takes the input from the request body and passes it to the usecase.
 * The usecase then executes the necessary operations to send the OTP.
 * Finally, the result is handled and returned to the user.
 * @param req Express Request
 * @param res Express Response
 * @param next Express NextFunction
 */
export const sentOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input: SentOtpPostReqOtp = req.body

    /**
     * Passing data to usecase
     */
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await sentOtpUseCase(input, mysqlAuthRepo, t)
    })

    /**
     * Handling result
     */
    handleResult(
      req,
      res,
      next,
      StatusCodes.CREATED,
      'OTP_SENT_SUCCESSFULLY',
      data,
    )
  } catch (error) {
    next(error)
  }
}
