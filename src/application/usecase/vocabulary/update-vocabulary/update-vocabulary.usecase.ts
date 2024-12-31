import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { VocabularyPatchReqInner } from '../../../../domain/entities/vocabulary/update-vocabulary.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { CONSTANTS } from '../../../../infrastructure/configs/constants/constants'
import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { uploadImage } from '../../../../infrastructure/helpers/fs'
import { formatError } from '../../../../infrastructure/helpers/res'
import { VocabularyRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary-repo.interface'

export const updateVocabularyUseCase = async (
  input: VocabularyPatchReqInner,
  role: USER_ROLES,
  repoVocab: VocabularyRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  const existFilter = convertToPagination({
    id: input.updated_by,
    created_by: role === USER_ROLES.USER ? input.updated_by : undefined,
  })
  // Check if record already exists
  const existingRecord = await repoVocab.get(existFilter, t)
  if (O.isNone(existingRecord)) {
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }
  // Update record
  if (input.image) {
    const { fileName } = await uploadImage(
      input.image as Express.Multer.File,
      CONSTANTS.DEFAULT_VALUES.VOCABULARY_IMAGE_FOLDER,
    )
    input.image = fileName
  }

  const updatedRecord = await repoVocab.update(input, t)
  if (!updatedRecord) {
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }

  return E.right(undefined)
}
