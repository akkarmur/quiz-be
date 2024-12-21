import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import moment from 'moment'
import { Transaction } from 'sequelize'

import { ForgotPasswordPatchReq } from '../../../../domain/entities/auth/forgot-password.interface'
import { GetOtpForVerifyPostReq } from '../../../../domain/entities/auth/sent-otp.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { CONSTANTS } from '../../../../infrastructure/configs/constants/constants'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { convertToMd5 } from '../../../../infrastructure/helpers/hash/md5.hash'
import { formatError } from '../../../../infrastructure/helpers/res'
import { AuthRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.interface'
import { UserRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.interface'

/**
 * Forgot password use case
 * @param input Input data for forgot password
 * @param authRepo Auth repository
 * @param userRepo User repository
 * @param t Transaction
 * @returns Either ApplicationError or void
 */
export const forgotPasswordUseCase = async (
  input: ForgotPasswordPatchReq,
  authRepo: AuthRepoInterface,
  userRepo: UserRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  const otpInput: GetOtpForVerifyPostReq = {
    otp: input.otp,
    email: input.email,
    device_id: input.device_id,
  }

  /**
   * Check if the record for otp exists
   * This is to make sure that the OTP provided is valid
   * If the OTP is valid, then we can update the user's password
   */
  const otp = await authRepo.getOneOtp(otpInput)
  if (O.isSome(otp)) {
    /**
     * Save current and otp time and compare difference
     * This is to check if the OTP has expired
     * If the OTP has expired, then we will return an error
     */
    const otpCreatedTime = moment(otp.value.created_at)
    const currentTime = moment()
    const timeDifference = currentTime.diff(otpCreatedTime, 'minutes')
    if (timeDifference > CONSTANTS.DEFAULT_VALUES.OTP_DURATION) {
      return E.left(formatError(StatusCodes.UNAUTHORIZED, 'OTP_EXPIRED'))
    }

    /**
     * Delete the record for the otp
     * After the OTP has been verified, we will delete the record for the OTP
     * This is to prevent the OTP from being reused
     */
    await authRepo.deleteOtp(otpInput, t)

    /**
     * Format data to be able to update
     * We will format the input data to be able to update the user's password
     * This includes hashing the password and formatting the updated_by field
     */
    const inputData = input
    inputData.password = convertToMd5(input.password)
    inputData.updated_by = input.email

    /**
     * Save the change to user table
     * @returns {void}
     * This is the actual call to the user repository to update the user's password
     * If the update is successful, then we will return void
     * If the update fails, then we will return an error
     */
    const affectedRows = await userRepo.changePassword(inputData, t)
    if (!affectedRows) {
      return E.left(formatError(StatusCodes.NOT_FOUND, 'USER_NOT_REGISTERED'))
    }
    return E.right(undefined)
  } else {
    return E.left(formatError(StatusCodes.UNAUTHORIZED, 'OTP_INVALID'))
  }
}
