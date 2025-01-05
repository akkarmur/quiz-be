import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { Pagination } from '../../../../domain/entities/common/pagination'
import {
  Vocabulary200Data,
  Vocabulary200DataDataInnerFromJSON,
} from '../../../../domain/entities/vocabulary/get-vocabulary.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { formatError } from '../../../../infrastructure/helpers/res'
import { VocabularyRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary-repo.interface'

export const getVocabularyUseCase = async (
  paginationData: Pagination,
  repo: VocabularyRepoInterface,
  isActive: boolean,
  t: Transaction,
): Promise<E.Either<ApplicationError, Vocabulary200Data>> => {
  // Get the list of records
  const records = await repo.get(paginationData, t)

  // Get the count of records
  const totalCount = await repo.getCount(paginationData, t)

  // If data is found, format the response
  if (O.isSome(records)) {
    const formattedData = records.value.map((item) =>
      Vocabulary200DataDataInnerFromJSON(item, isActive),
    )
    return E.right({ totalCount, data: formattedData })
  } else {
    // If no data is found, return an error
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }
}
