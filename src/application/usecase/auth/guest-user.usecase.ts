import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import { GuestUserRegistrationPostReq } from '../../../domain/entities/user/guest-user-put.interface'
import { ApplicationError } from '../../../infrastructure/configs/constants/application-tag'
import { AuthRepoInterface } from '../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.interface'

/**
 * Use case for registering or updating a guest user.
 * This use case is responsible for creating a new guest user
 * or updating an existing guest user's login details.
 *
 * @param {GuestUserRegistrationPostReq} input - The guest user registration request.
 * @param {AuthRepoInterface} authRepo - The authentication repository interface.
 * @param {Transaction} t - The transaction instance.
 * @param {number} [userId] - Optional user ID for identifying existing users.
 * @returns {Promise<E.Either<ApplicationError, void>>} - Either an application error or void on success.
 */
export const guestUserUseCase = async (
  input: GuestUserRegistrationPostReq,
  authRepo: AuthRepoInterface,
  t: Transaction,
  userId?: number,
): Promise<E.Either<ApplicationError, void>> => {
  // Prepare the login details to be saved or updated
  // We add the is_active, created_by, and updated_by fields
  // with default values. created_by and updated_by are set to 'guest'
  // as the guest user is being created or updated by the guest user
  // itself.
  const loginDetailsInput = {
    is_active: true,
    created_by: 'guest',
    updated_by: 'guest',
    // Add the input fields to the login details
    ...input,
  }

  // Determine the filter criteria for checking existing login details
  // If a user ID is provided, use it to filter the login details
  // by user ID and device ID.
  // Otherwise, use only the device ID to filter the login details.
  const filterPayload = userId
    ? { device_id: input.device_id, user_id: userId }
    : { device_id: input.device_id }

  // Fetch login details based on the filter criteria
  // This will return either some login details or none at all.
  const loginDetails = await authRepo.getLoginDetails(filterPayload)

  // If no existing login details are found, insert new ones
  if (O.isNone(loginDetails)) {
    // Insert the new login details into the database
    await authRepo.insertLoginDetails(loginDetailsInput, t)
  } else {
    // Update the created_by and updated_by fields with existing user_id if present
    // This is done to ensure that the created_by and updated_by fields
    // are updated with the correct user ID if an existing user is being
    // updated.
    loginDetailsInput.created_by = String(
      loginDetails.value.user_id ?? loginDetailsInput.created_by,
    )
    loginDetailsInput.updated_by = String(
      loginDetails.value.user_id ?? loginDetailsInput.updated_by,
    )

    // Update the existing login details with the new input
    // This will update the existing login details with the new
    // device ID and other fields.
    await authRepo.updateLoginDetails(loginDetailsInput, t)
  }

  // Return a successful result
  return E.right(undefined)
}
