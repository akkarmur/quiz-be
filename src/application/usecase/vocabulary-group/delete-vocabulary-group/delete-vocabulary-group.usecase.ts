import * as E from 'fp-ts/Either'
import { Transaction } from 'sequelize'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { formatError } from '../../../../infrastructure/helpers/res'
import { VocabularyGroupRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group-repo.interface'

/**
 * Deletes a VocabularyGroup by its ID.
 * If the user is not an admin, the deleted VocabularyGroup must be created by the user.
 * @param id The ID of the VocabularyGroup to be deleted
 * @param tokenDetail The details of the user who is performing the deletion
 * @param repo The repository to use for the deletion
 * @param t The transaction to use for the deletion
 * @returns A promise that resolves to either an ApplicationError or void
 */
export const deleteVocabularyGroupUseCase = async (
  id: number,
  tokenDetail: TokenDetails,
  repo: VocabularyGroupRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  const deleteFilter: { id: number; created_by?: number } = {
    id,
  }
  // If the user is not an admin, the deleted VocabularyGroup must be created by the user
  if (tokenDetail.role === USER_ROLES.USER) {
    deleteFilter.created_by = tokenDetail.id
  }
  const existingRecord = await repo.delete(deleteFilter, t)
  if (!existingRecord) {
    // If the VocabularyGroup is not found, return an error
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }
  // If the VocabularyGroup is found and deleted, return void
  return E.right(undefined)
}
