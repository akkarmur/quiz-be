import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { Pagination } from '../../../../domain/entities/common/pagination'
import {
  VocabularyGroup200Data,
  VocabularyGroup200DataDataInner,
  VocabularyGroup200DataDataInnerFromJSONTyped,
} from '../../../../domain/entities/vocabulary-group/get-voca-group.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { formatError } from '../../../../infrastructure/helpers/res'
import { VocabularyGroupRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group-repo.interface'

/**
 * Use case for fetching a paginated list of vocabulary groups.
 *
 * @param paginationData The pagination data.
 * @param repo The repository for the vocabulary groups.
 * @param isActive The flag for filtering active records.
 * @param t The sequelize transaction.
 */
export const getVocabularyGroupUseCase = async (
  paginationData: Pagination,
  repo: VocabularyGroupRepoInterface,
  isActive: boolean,
  t: Transaction,
): Promise<E.Either<ApplicationError, VocabularyGroup200Data>> => {
  // Get the list of records
  const records = await repo.get(paginationData, t)

  // Get the count of records
  const totalCount = await repo.getCount(paginationData, t)

  // If data is found, format the response
  if (O.isSome(records)) {
    // Map the records to the response format
    const formattedData: VocabularyGroup200DataDataInner[] = records.value.map(
      (item) => VocabularyGroup200DataDataInnerFromJSONTyped(item, isActive),
    )

    // Return the response
    return E.right({ totalCount, data: formattedData })
  } else {
    // If no data is found, return an error
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }
}
