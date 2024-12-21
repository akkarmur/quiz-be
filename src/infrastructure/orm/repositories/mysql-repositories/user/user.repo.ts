import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import { ForgotPasswordUpdateDetailsReq } from '../../../../../domain/entities/auth/forgot-password.interface'
import { RegistrationDbData } from '../../../../../domain/entities/auth/registration.interface'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { UserGetDB } from '../../../../../domain/entities/user/user-get.interface'
import { UserPatchReq } from '../../../../../domain/entities/user/user-update.interface'
import { optionFormatForArray } from '../../../../helpers/fm-ts'
import User from '../../../sequelize/entities/m_user'
import { mysqlCommonRepo } from '../common/common.repo'
import { UserRepoInterface } from './user-repo.interface'

export const mysqlUserRepo: UserRepoInterface = {
  /**
   * Creates a new user record in the database
   * @param input The user registration data to be inserted
   * @param t The transaction instance
   * @returns A promise that resolves to the newly created user instance
   */
  createUser: async (
    input: RegistrationDbData,
    t: Transaction,
  ): Promise<User> => {
    return await User.create(input, { transaction: t })
  },

  /**
   * Retrieves a list of users from the database
   * @param paginationData The pagination data to be used for the query
   * @param t The transaction instance
   * @returns A promise that resolves to an array of user objects
   */
  get: async (
    paginationData: Pagination,
    t: Transaction,
  ): Promise<O.Option<UserGetDB[]>> => {
    const { fields, order, limit, offset } = paginationData
    const where = mysqlCommonRepo.whereCondition(fields)
    const orderBy = mysqlCommonRepo.convertOrder(order)

    /**
     * Retrieves the list of users from the database
     * @returns A promise that resolves to an array of user objects
     */
    const data = await User.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'is_active',
        'role',
        'profile_image',
        'created_at',
        'updated_at',
      ],
      where,
      limit,
      offset,
      order: orderBy,
      transaction: t,
    })

    /**
     * Formats the returned data into an array of UserGetDB objects
     * @returns A promise that resolves to an array of UserGetDB objects
     */
    return optionFormatForArray<UserGetDB>(data)
  },

  /**
   * Retrieves the count of records in the user table that matches the given
   * pagination data
   * @param paginationData The pagination data to be used for the query
   * @param t The transaction instance
   * @returns A promise that resolves to the count of records
   */
  getCount: async (
    paginationData: Pagination,
    t: Transaction,
  ): Promise<number> => {
    // Extract the fields from the pagination data
    const { fields } = paginationData

    // Convert the fields to a Sequelize where condition
    const where = mysqlCommonRepo.whereCondition(fields)

    // Retrieve the count of records from the user table
    const userCount = await User.count({
      // Use the converted where condition for the query
      where,
      // Use the provided transaction instance
      transaction: t,
    })

    // Return the count of records
    return userCount
  },

  /**
   * Updates the password for a user in the database
   * @param input The input data containing the email and new password
   * @param transaction The transaction instance
   * @returns A promise that resolves to the affected row count
   */
  changePassword: async (
    input: ForgotPasswordUpdateDetailsReq,
    transaction: Transaction,
  ): Promise<number> => {
    // Update the password for the user in the database
    const [affectedRowCount] = await User.update(input, {
      // Use the email as the condition for the update
      where: {
        email: input.email,
      },
      // Use the provided transaction instance
      transaction: transaction,
    })

    // Return the affected row count
    return affectedRowCount
  },

  /**
   * Updates a user record in the database
   * @param input The user data to be updated
   * @param transaction The transaction instance
   * @returns A promise that resolves to void
   */
  updateUser: async (
    input: UserPatchReq,
    transaction: Transaction,
  ): Promise<void> => {
    // Update the user record in the database
    await User.update(input, {
      // Use the user ID as the condition for the update
      where: {
        id: input.id,
      },
      // Use the provided transaction instance
      transaction: transaction,
    })
  },
}
