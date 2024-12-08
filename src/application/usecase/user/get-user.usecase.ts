import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'

import { Pagination } from '../../../domain/entities/common/pagination'
import {
  UserGetRes,
  UserGetResDataInnerFromJSON,
} from '../../../domain/entities/user/user-get.interface'
import { ApplicationError } from '../../../infrastructure/configs/constants/application-tag'
import { StatusCodes } from '../../../infrastructure/configs/constants/statusCodes'
import { formatError } from '../../../infrastructure/helpers/res'
import { UserRepoInterface } from '../../../infrastructure/orm/repositories/mysql-repositories/user/user-repo.interface'

/**
 * getUserUseCase
 * This function is a use case for getting a list of users.
 * It takes in the pagination data, user repository, isActive flag, and transaction as parameters.
 * The function will get the list of users based on the pagination data and isActive flag.
 * It will also get the count of all records that match the pagination data.
 * If the data is found, it will convert the data to the format that is expected by the client.
 * If the data is not found, it will return an error.
 *
 * @param paginationData - The pagination data that is used to filter the records.
 * @param userRepo - The user repository that is used to interact with the database.
 * @param isActive - A flag that indicates whether to filter by active users or not.
 * @param t - The transaction that is used to ensure data consistency.
 * @returns - Either an application error or a user page response object.
 */
export const getUserUseCase = async (
  paginationData: Pagination,
  userRepo: UserRepoInterface,
  isActive: boolean,
  t: Transaction,
): Promise<E.Either<ApplicationError, UserGetRes>> => {
  /**
   * First, we need to get the list of users based on the pagination data and isActive flag.
   * We will use the user repository to get the list of users.
   */
  const user = await userRepo.get(paginationData, t)

  /**
   * Next, we need to get the count of all records that match the pagination data.
   * We will use the user repository to get the count.
   */
  const userCount = await userRepo.getCount(paginationData, t)

  /**
   * If the data is found, we need to convert the data to the format that is expected by the client.
   * We will use the UserGetResDataInnerFromJSON function to convert the data.
   */
  if (O.isSome(user)) {
    const userData = user.value.map((item) =>
      UserGetResDataInnerFromJSON(item, isActive),
    )
    const userPageRes = { totalCount: userCount, data: userData }
    return E.right(userPageRes)
  } else {
    /**
     * If the data is not found, we will return an error.
     * We will use the formatError function to format the error.
     */
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }
}
