import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import {
  FindLoginReq,
  LoginDetails,
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
import { formatError } from '../../../../infrastructure/helpers/res'
import { generateJWTHS512Token } from '../../../../infrastructure/helpers/token/jwt-HS512.token'
import { AuthRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.interface'
import { UserRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.interface'

/**
 * Refresh token use case
 * This use case is responsible for generating a new access token and refresh token
 * when the user provides a valid refresh token.
 * The use case fetches the user data based on the user ID and device ID, and then
 * generates a new access token and refresh token using the JSON Web Tokens (JWT) library.
 * Finally, the use case updates the login table with the new refresh token.
 *
 * @param input The input data required for refreshing the token.
 * @param authRepo The authentication repository interface.
 * @param userRepo The user repository interface.
 * @param t The transaction instance.
 * @returns Either an application error or a login response object containing the new access and refresh tokens.
 */
export const refreshTokenUseCase = async (
  input: FindLoginReq,
  authRepo: AuthRepoInterface,
  userRepo: UserRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, loginRes>> => {
  // Convert the user ID from the input to a Pagination object for querying
  const userId: Pagination = convertToPagination({
    id: `${input.user_id}`,
  })

  // Fetch user and login details from the repositories
  const user = await userRepo.get(userId, t)
  const loginDetails = await authRepo.getLoginDetails(input)

  // Check if both user and login details are found
  if (O.isSome(user) && O.isSome(loginDetails)) {
    // Generate a new refresh token using the JWT library
    const refreshToken = generateJWTHS512Token(
      LoginTokenDetailsFromJSON({
        device_id: input.device_id,
        ...LoginTokenDetailsFromJSON(user.value[0]),
      }),
      env.JWT_HS512_REFRESH_SECRET,
      CONSTANTS.DEFAULT_VALUES.REFRESH_TOKEN_DURATION,
    )

    // Generate a new access token using the JWT library
    const accessToken = generateJWTHS512Token(
      LoginTokenDetailsFromJSON({
        device_id: input.device_id,
        ...LoginTokenDetailsFromJSON(user.value[0]),
      }),
      env.JWT_HS512_ACCESS_SECRET,
      CONSTANTS.DEFAULT_VALUES.ACCESS_TOKEN_DURATION,
    )

    // Prepare the data to update the login details with the new refresh token
    const loginDetailsInput: LoginDetails = {
      ...input, // Copy the input data
      is_active: true, // Set the session to active
      refresh_token: refreshToken, // Assign the new refresh token
    }

    // Update the login table with the new refresh token
    await authRepo.updateLoginDetails(loginDetailsInput, t)

    // Return the new tokens as a successful response
    return E.right({ refresh_token: refreshToken, access_token: accessToken })
  } else {
    // Return an unauthorized error if user or login details are not found
    return E.left(formatError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED'))
  }
}
