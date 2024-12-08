import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import { ForgotPasswordUpdateDetailsReq } from '../../../../../domain/entities/auth/forgot-password.interface'
import { RegistrationDbData } from '../../../../../domain/entities/auth/registration.interface'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { UserGetDB } from '../../../../../domain/entities/user/user-get.interface'
import { UserPatchReq } from '../../../../../domain/entities/user/user-update.interface'
import User from '../../../sequelize/entities/m_user'

/**
 * User Repo Interface
 *
 * This interface is used to define the methods that
 * User Repository should have
 */
export type UserRepoInterface = {
  /**
   * createUser method is used to create a new user
   *
   * It takes in a RegistrationDbData object and a Transaction
   * object and returns a Promise of a User object
   */
  createUser: (
    input: RegistrationDbData,
    transaction: Transaction,
  ) => Promise<User>

  /**
   * get method is used to get a list of users
   *
   * It takes in a Pagination object and a Transaction
   * object and returns a Promise of an Option of an array
   * of UserGetDB objects
   */
  get: (
    paginationData: Pagination,
    transaction: Transaction,
  ) => Promise<O.Option<UserGetDB[]>>

  /**
   * getCount method is used to get the count of users
   *
   * It takes in a Pagination object and a Transaction
   * object and returns a Promise of a number
   */
  getCount: (
    paginationData: Pagination,
    transaction: Transaction,
  ) => Promise<number>

  /**
   * changePassword method is used to change the password
   * of a user
   *
   * It takes in a ForgotPasswordUpdateDetailsReq object and
   * a Transaction object and returns a Promise of a number
   */
  changePassword: (
    input: ForgotPasswordUpdateDetailsReq,
    transaction: Transaction,
  ) => Promise<number>

  /**
   * updateUser method is used to update a user
   *
   * It takes in a UserPatchReq object and a Transaction
   * object and returns a Promise of void
   */
  updateUser: (input: UserPatchReq, transaction: Transaction) => Promise<void>
}
