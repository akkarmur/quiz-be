import * as E from 'fp-ts/Either'
import { Transaction } from 'sequelize'

import { SentOtpPostReqOtp } from '../../../domain/entities/auth/sent-otp.interface'
import { ApplicationError } from '../../../infrastructure/configs/constants/application-tag'
import { randomNumber } from '../../../infrastructure/helpers/utils/random-number'
import { AuthRepoInterface } from '../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.interface'

/**
 * Sent OTP use case
 * This use case is responsible for generating and sending a One-Time Password (OTP)
 * to a user's email address. It first deletes any existing OTP for the given input,
 * generates a new OTP, inserts it into the database, and then sends the OTP to the
 * user's email address.
 * @param input The input data for the sent OTP use case
 * @param authRepo The authentication repository interface
 * @param t The transaction instance
 * @returns Either an application error or void on success
 */
export const sentOtpUseCase = async (
  input: SentOtpPostReqOtp,
  authRepo: AuthRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  /**
   * Step 1: Delete existing OTP
   * If an OTP already exists for the given input, it will be deleted from the repository.
   * This ensures that only one valid OTP exists at a time for a particular request.
   */
  await authRepo.deleteOtp(input, t)

  /**
   * Step 2: Generate a new OTP
   * A 6-digit random number is generated to be used as the OTP.
   * The randomNumber function ensures the OTP is in the correct format.
   */
  input.otp = randomNumber(6)

  /**
   * Step 3: Insert the new OTP into the database
   * The newly generated OTP is inserted into the t_otp table using the auth repository.
   * This step saves the OTP for future verification when needed.
   */
  const result = await authRepo.insertOtp(input, t)

  /**
   * Step 4: Send OTP to the user's email
   * Although currently commented out, this step would involve sending the OTP to the user's email.
   * This ensures the user receives the OTP for verification purposes.
   */
  // await sendSMS(input.email, input.otp)

  /**
   * Step 5: Return success
   * If all operations are successful, return a right Either indicating success.
   * The result variable is used here to denote the operation outcome.
   */
  return E.right(result)
}
