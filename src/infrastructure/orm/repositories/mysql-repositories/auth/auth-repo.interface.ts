import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import {
  FindLoginReq,
  LoginDetails,
} from '../../../../../domain/entities/auth/login.interface'
import {
  GetOtpForVerifyPostReq,
  OtpGetDB,
  SentOtpPostReq,
} from '../../../../../domain/entities/auth/sent-otp.interface'

/**
 * Auth Repo Interface
 */
export type AuthRepoInterface = {
  /**
   * Inserts OTP to the t_otp table
   *
   * @param input The input object containing the OTP data
   * @param transaction The Sequelize transaction object
   * @returns A promise which resolves to void
   */
  insertOtp: (input: SentOtpPostReq, transaction: Transaction) => Promise<void>

  /**
   * Retrieves an OTP from the t_otp table
   *
   * @param input The input object containing the OTP data
   * @returns A promise which resolves to an optional OTP from the database
   */
  getOneOtp: (input: GetOtpForVerifyPostReq) => Promise<O.Option<OtpGetDB>>

  /**
   * Deletes an OTP from the t_otp table
   *
   * @param input The input object containing the OTP data
   * @param transaction The Sequelize transaction object
   * @returns A promise which resolves to void
   */
  deleteOtp: (
    input: GetOtpForVerifyPostReq,
    transaction: Transaction,
  ) => Promise<void>

  /**
   * Retrieves a login details from the t_login table
   *
   * @param input The input object containing the login data
   * @returns A promise which resolves to an optional login details from the database
   */
  getLoginDetails: (input: FindLoginReq) => Promise<O.Option<LoginDetails>>

  /**
   * Inserts a new login details entry into the t_login table
   *
   * @param input The input object containing the login details
   * @param transaction The Sequelize transaction object
   * @returns A promise which resolves to void
   */
  insertLoginDetails: (
    input: LoginDetails,
    transaction: Transaction,
  ) => Promise<void>

  /**
   * Updates an existing login details entry in the t_login table
   *
   * @param input The input object containing the login details
   * @param transaction The Sequelize transaction object
   * @returns A promise which resolves to void
   */
  updateLoginDetails: (
    input: LoginDetails,
    transaction: Transaction,
  ) => Promise<void>
}
