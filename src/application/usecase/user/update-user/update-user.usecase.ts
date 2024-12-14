import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { UserPatchReq } from '../../../../domain/entities/user/user-update.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { CONSTANTS } from '../../../../infrastructure/configs/constants/constants'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { uploadImage } from '../../../../infrastructure/helpers/fs'
import { formatError } from '../../../../infrastructure/helpers/res'
import { UserRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.interface'

/**
 * updateUserUseCase
 * This function is responsible for updating a user's information in the database.
 * It takes in a user repository, user input data, and a transaction to ensure data consistency.
 * The function performs validation checks, updates the user details, and returns a success or error result.
 *
 * @param userRepo - The user repository used for interacting with the database.
 * @param input - The input data containing the user's information to be updated.
 * @param t - The transaction used to ensure data consistency during the update process.
 * @returns A promise that resolves to either an application error or void on success.
 */
export const updateUserUseCase = async (
  userRepo: UserRepoInterface,
  input: UserPatchReq,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  // Check if the input contains an ID to identify which user to update
  if (input.id) {
    // Convert the user ID into a pagination object for database querying
    const userFilter = convertToPagination({
      id: input.id,
    })

    // Fetch the user from the repository using the filter
    const user = await userRepo.get(userFilter, t)

    // If the user does not exist, return an error indicating conflict
    if (O.isNone(user)) {
      return E.left(formatError(StatusCodes.CONFLICT, 'USER_NOT_EXISTS'))
    }
  }

  // Initialize inputWithUrl with the provided input data
  // This will allow us to modify the input data if needed
  const inputWithUrl: UserPatchReq = {
    ...input,
  }

  // Check if the input contains an image to be uploaded
  if (input.image) {
    // Upload the image to the designated folder and get the file name
    const { fileName } = await uploadImage(
      input.image,
      CONSTANTS.DEFAULT_VALUES.USER_IMAGE_FOLDER,
    )

    // Update the profile_image field in the input data with the uploaded image URL
    inputWithUrl.profile_image = fileName
  }

  // Update the user information in the database using the modified input data
  await userRepo.updateUser(inputWithUrl, t)

  // Return a success result, indicating the user was successfully updated
  return E.right(undefined)
}
