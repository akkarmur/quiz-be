import * as E from 'fp-ts/Either'
import { Transaction } from 'sequelize'

import {
  FindLoginReq,
  LoginDetails,
} from '../../../../domain/entities/auth/login.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { AuthRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.interface'

/**
 * Logout use case
 * This use case is responsible for logging out a user
 * by deactivating their session and removing their refresh token.
 * It updates the login table to reflect these changes.
 *
 * @param input The input data required for logging out.
 * @param authRepo The authentication repository interface.
 * @param t The transaction instance.
 * @returns Either an application error or void on success.
 */
export const logoutUseCase = async (
  input: FindLoginReq, // The input data required for logging out.
  authRepo: AuthRepoInterface, // The authentication repository interface.
  t: Transaction, // The transaction instance.
): Promise<E.Either<ApplicationError, void>> => {
  /**
   * Creating data to remove refresh token and deactivate session
   * This object will contain the updated data required to deactivate the user's session
   * and remove the refresh token.
   */
  const loginDetailsInput: LoginDetails = {
    ...input, // Copy the input data.
    is_active: false, // Deactivate the session.
    refresh_token: '', // Remove the refresh token.
  }

  /**
   * Updating the login table to deactivate the session
   * and remove the refresh token
   * This will update the login table with the new data, effectively logging out the user.
   */
  const loginDetails = await authRepo.updateLoginDetails(loginDetailsInput, t)
  return E.right(loginDetails) // Return success if the update is successful.
}
