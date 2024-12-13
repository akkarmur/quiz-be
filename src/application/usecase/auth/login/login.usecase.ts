import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import {
  LoginPostReq,
  LoginPostReqFromJSON,
  loginRes,
  LoginTokenDetailsFromJSON,
} from '../../../../domain/entities/auth/login.interface'
import {
  convertToPagination,
  Pagination,
} from '../../../../domain/entities/common/pagination'
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
 * Login use case
 * This use case is responsible for authenticating a user
 * and issuing an access and refresh token.
 * The use case takes the user email and password as input,
 * hashes the password using MD5, and then uses the
 * user repository to fetch the user data based on the
 * email and password. If the user data is found, then
 * the use case creates the access and refresh tokens
 * using the JSON Web Tokens (JWT) library. The refresh
 * token is created with the refresh secret and a duration
 * of 30 days, while the access token is created with the
 * access secret and a duration of 1 hour.
 * Finally, the use case formats the data to be saved
 * to the login table and checks if the record for the
 * login details already exists. If the record does not
 * exist, or if it exists but the user ID does not match
 * the current user ID, then the use case inserts a new
 * record into the login table. Otherwise, the use case
 * updates the existing record.
 * @param input The input data for the login use case
 * @param userRepo The user repository
 * @param authRepo The authentication repository
 * @param t The transaction instance
 * @returns Either an application error or a login response object
 */
export const loginUseCase = async (
  input: LoginPostReq, // The input data for the login use case
  userRepo: UserRepoInterface, // The user repository
  authRepo: AuthRepoInterface, // The authentication repository
  t: Transaction, // The transaction instance
): Promise<E.Either<ApplicationError, loginRes>> => {
  /**
   * First, hash the password using MD5
   * This is done so that we can compare the input password with
   * the hashed password stored in the database.
   */
  input.password = convertToMd5(input.password) // Hash the password using MD5

  /**
   * Next, convert the input data to a Pagination object
   * This is done so that we can easily filter the user data
   * by the email and password.
   */
  const userFilter: Pagination = convertToPagination({
    password: input.password, // The hashed password
    email: input.email, // The email address
  })

  /**
   * Then, use the user repository to fetch the user data
   * based on the filter criteria.
   * The result will be either some user data or none at all.
   */
  const user = await userRepo.get(userFilter, t) // Fetch the user data

  if (O.isSome(user)) {
    /**
     * If the user data is found, then create the access and refresh tokens
     * using the JSON Web Tokens (JWT) library.
     * The refresh token is created with the refresh secret and a duration
     * of 30 days, while the access token is created with the access secret
     * and a duration of 1 hour.
     */
    const refreshToken = generateJWTHS512Token(
      {
        device_id: input.device_id, // The device ID
        ...LoginTokenDetailsFromJSON(user.value[0]), // The user data
      },
      env.JWT_HS512_REFRESH_SECRET, // The refresh secret
      CONSTANTS.DEFAULT_VALUES.REFRESH_TOKEN_DURATION, // The duration of 30 days
    )
    const accessToken = generateJWTHS512Token(
      {
        device_id: input.device_id, // The device ID
        ...LoginTokenDetailsFromJSON(user.value[0]), // The user data
      },
      env.JWT_HS512_ACCESS_SECRET, // The access secret
      CONSTANTS.DEFAULT_VALUES.ACCESS_TOKEN_DURATION, // The duration of 1 hour
    )

    /**
     * Then, format the data to be saved to the login table
     * by creating a new object with the user ID, refresh token,
     * and other fields.
     */
    const userId = user.value[0].id as number // The user ID

    const loginDetailsInput = {
      user_id: userId, // The user ID
      refresh_token: refreshToken, // The refresh token
      is_active: true, // The user is active
      created_by: `${userId}`, // The created by field is the user ID
      updated_by: `${userId}`, // The updated by field is the user ID
      ...LoginPostReqFromJSON(input), // The device ID and other fields
    }

    /**
     * Next, check if the record for the login details already exists
     * by fetching the login details based on the device ID.
     * The result will be either some login details or none at all.
     */
    const loginDetails = await authRepo.getLoginDetails({
      device_id: input.device_id, // The device ID
    })

    /**
     * If the record does not exist, or if it exists but the user ID
     * does not match the current user ID, then insert a new record
     * into the login table.
     * Otherwise, update the existing record.
     */
    if (
      O.isNone(loginDetails) ||
      (loginDetails.value?.user_id && loginDetails.value?.user_id !== userId)
    ) {
      await authRepo.insertLoginDetails(loginDetailsInput, t) // Insert a new record
    } else {
      await authRepo.updateLoginDetails(loginDetailsInput, t) // Update the existing record
    }

    /**
     * Finally, return the refresh and access tokens
     * as a login response object.
     */
    return E.right({ refresh_token: refreshToken, access_token: accessToken })
  } else {
    /**
     * If the user data is not found, then return an error
     * with the status code 401 (Unauthorized)
     * and a message indicating that the credentials are invalid.
     */
    return E.left(formatError(StatusCodes.UNAUTHORIZED, 'INVALID_CREDENTIALS'))
  }
}
