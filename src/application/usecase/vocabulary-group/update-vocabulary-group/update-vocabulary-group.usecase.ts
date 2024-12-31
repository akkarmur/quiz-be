import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { VocabularyGroupPatchReqInner } from '../../../../domain/entities/vocabularyGroup/update-voca-group.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { formatError } from '../../../../infrastructure/helpers/res'
import { VocabularyGroupRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group-repo.interface'

/**
 * Use case for updating a VocabularyGroup.
 * The use case will first check if the VocabularyGroup to be updated exists.
 * It will then check if the new name is already taken by another VocabularyGroup.
 * If the new name is taken, it will return an error.
 * If the new name is not taken, it will update the VocabularyGroup.
 * @param data The data to be updated.
 * @param role The role of the user who is performing the update.
 * @param repo The repository to use for the update.
 * @param t The transaction to use for the update.
 */
export const updateVocabularyGroupUseCase = async (
  data: VocabularyGroupPatchReqInner,
  role: USER_ROLES,
  repo: VocabularyGroupRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  const existFilter = convertToPagination({
    id: data.id,
    created_by: role === USER_ROLES.USER ? data.updated_by : undefined,
  })
  // Check if record already exists
  const existingRecord = await repo.get(existFilter, t)
  if (O.isNone(existingRecord)) {
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }

  const existName = convertToPagination({
    name: data.name,
    id: `${data.id} | not_equals`,
  })
  const existingName = await repo.get(existName, t)
  if (O.isSome(existingName)) {
    return E.left(
      formatError(StatusCodes.CONFLICT, 'ALREADY_EXIST', {
        message: `VocabularyGroup with name ${data.name} already exists`,
      }),
    )
  }

  // Update record
  const updatedRecord = await repo.update(data, t)
  if (updatedRecord === 0) {
    return E.left(
      formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND', {
        message: `No VocabularyGroup with id ${data.id} found`,
      }),
    )
  }

  return E.right(undefined)
}
