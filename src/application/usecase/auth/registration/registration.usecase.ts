import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import moment from 'moment'
import { Transaction } from 'sequelize'

import {
  loginRes,
  LoginTokenDetailsFromJSON,
} from '../../../../domain/entities/auth/login.interface'
import {
  RegistrationDbData,
  RegistrationPostReq,
} from '../../../../domain/entities/auth/registration.interface'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { CONSTANTS } from '../../../../infrastructure/configs/constants/constants'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { env } from '../../../../infrastructure/env'
import { convertToMd5 } from '../../../../infrastructure/helpers/hash/md5.hash'
import { formatError } from '../../../../infrastructure/helpers/res'
import { generateJWTHS512Token } from '../../../../infrastructure/helpers/token/jwt-HS512.token'
import { AuthRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.interface'
import { UserRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.interface'

/**
 * Registration use case
 * This use case is responsible for registering a new user
 * and issuing the user a refresh and access token.
 * The use case takes the user registration data as input,
 * hashes the password using MD5, and then uses the
 * user repository to create a new user record.
 * After the user is created, the use case generates the
 * refresh and access tokens using JWT and saves the
 * refresh token to the login table.
 * @param input The user registration data
 * @param authRepo The authentication repository interface
 * @param userRepo The user repository interface
 * @param t The transaction instance
 * @returns Either an application error or a login response object
 */
export const registrationUseCase = async (
  input: RegistrationPostReq,
  authRepo: AuthRepoInterface,
  userRepo: UserRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, loginRes>> => {
  // Check if a user with the provided email exists
  const emailFilter = convertToPagination({
    email: input.email,
  })

  const userByEmail = await userRepo.get(emailFilter, t)

  if (O.isSome(userByEmail)) {
    // If a user with the provided email exists, return a conflict error
    return E.left(formatError(StatusCodes.CONFLICT, 'ALREADY_EXIST'))
  }

  // Check if an OTP record exists for the provided input
  const otp = await authRepo.getOneOtp(input)

  if (O.isSome(otp)) {
    // Calculate the time difference between OTP creation and current time
    const otpCreatedTime = moment(otp.value.created_at)
    const currentTime = moment()
    const timeDifference = currentTime.diff(otpCreatedTime, 'minutes')

    // If the OTP has expired, return an unauthorized error
    if (timeDifference > CONSTANTS.DEFAULT_VALUES.OTP_DURATION) {
      return E.left(formatError(StatusCodes.UNAUTHORIZED, 'OTP_EXPIRED'))
    }

    // Delete the OTP record as it has been verified
    await authRepo.deleteOtp(input, t)

    // Prepare user registration data
    const userInput: RegistrationDbData = {
      email: input.email,
      name: input.name,
      password: input.password,
    }

    // Hash the user's password using MD5
    userInput.password = convertToMd5(input.password)
    userInput.created_by = input.email
    userInput.updated_by = input.email

    // Create a new user record in the user repository
    const user = await userRepo.createUser(userInput, t)

    // Prepare JWT data for token creation
    const jwtData = {
      id: user.id,
      email: user.email,
      role: user.role,
      device_id: input.device_id,
    }

    // Generate refresh and access tokens using JWT
    const refreshToken = generateJWTHS512Token(
      LoginTokenDetailsFromJSON(jwtData),
      env.JWT_HS512_REFRESH_SECRET,
      CONSTANTS.DEFAULT_VALUES.REFRESH_TOKEN_DURATION,
    )
    const accessToken = generateJWTHS512Token(
      LoginTokenDetailsFromJSON(jwtData),
      env.JWT_HS512_ACCESS_SECRET,
      CONSTANTS.DEFAULT_VALUES.ACCESS_TOKEN_DURATION,
    )

    // Prepare login details for saving in the login table
    const loginDetailsInput = {
      user_id: user.id as number,
      refresh_token: refreshToken,
      is_active: true,
      created_by: `${user.id}`,
      updated_by: `${user.id}`,
      device_id: input.device_id,
      device_token: input.device_token,
      os: input.os,
    }

    // Check if login details already exist for the device
    const loginDetails = await authRepo.getLoginDetails({
      device_id: input.device_id,
    })
    const userId = user.id as number

    // Insert or update login details based on whether they exist
    if (
      O.isNone(loginDetails) ||
      (loginDetails.value?.user_id && loginDetails.value?.user_id !== userId)
    ) {
      await authRepo.insertLoginDetails(loginDetailsInput, t)
    } else {
      await authRepo.updateLoginDetails(loginDetailsInput, t)
    }

    // Return the generated tokens
    return E.right({ refresh_token: refreshToken, access_token: accessToken })
  } else {
    // If no OTP exists, return an unauthorized error
    return E.left(formatError(StatusCodes.UNAUTHORIZED, 'OTP_INVALID'))
  }
}
