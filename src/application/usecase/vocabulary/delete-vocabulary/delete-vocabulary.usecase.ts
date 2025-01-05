import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { TokenDetails } from '../../../../domain/entities/common/JWT'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { formatError } from '../../../../infrastructure/helpers/res'
import { VocabularyRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary-repo.interface'

export const deleteVocabularyUseCase = async (
  id: number,
  tokenDetails: TokenDetails,
  repo: VocabularyRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  const existFilter = convertToPagination({
    id: id,
    created_by:
      tokenDetails.role === USER_ROLES.USER ? tokenDetails.id : undefined,
  })
  // Check if record already exists
  const existingRecord = await repo.get(existFilter, t)
  if (O.isNone(existingRecord)) {
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }
  // Delete record
  const deletedRecord = await repo.delete(
    { id, created_by: tokenDetails.id },
    t,
  )
  if (!deletedRecord) {
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }

  return E.right(undefined)
}
