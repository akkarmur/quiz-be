import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { VocabularyGroupPostReqInner } from '../../../../domain/entities/vocabularyGroup/insert-voca-group.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { formatError } from '../../../../infrastructure/helpers/res'
import { VocabularyGroupRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group-repo.interface'

/**
 * Use case for inserting a new vocabulary group.
 *
 * @param data - The data for the vocabulary group to be inserted.
 * @param tokenDetails - The token details for the user who is performing the insertion.
 * @param repo - The repository for the vocabulary group.
 * @param t - The transaction object for the database.
 *
 * @returns A promise which will resolve to either an error or undefined.
 */
export const insertVocabularyGroupUseCase = async (
  data: VocabularyGroupPostReqInner,
  tokenDetails: TokenDetails,
  repo: VocabularyGroupRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  // Check if a vocabulary group with the same name already exists
  const existFilter = convertToPagination({
    name: data.name,
  })
  const existingRecord = await repo.get(existFilter, t)
  // If it does, return an error
  if (O.isSome(existingRecord)) {
    return E.left(formatError(StatusCodes.CONFLICT, 'ALREADY_EXIST'))
  }

  // Otherwise, insert the new vocabulary group
  const insertedRecord = await repo.insert(data, tokenDetails, t)
  // If the insertion is successful, return undefined
  return E.right(insertedRecord)
}
