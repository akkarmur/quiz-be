import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import { VocabularyPostReq } from '../../../../domain/entities/vocabulary/insert-vocabulary.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { formatError } from '../../../../infrastructure/helpers/res'
import { VocabularyGroupRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary-group/vocabulary-group-repo.interface'
import { VocabularyRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary-repo.interface'

export const insertVocabularyUseCase = async (
  inputs: VocabularyPostReq,
  userId: number,
  repoVocab: VocabularyRepoInterface,
  repoVocabGroup: Pick<VocabularyGroupRepoInterface, 'get'>,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  const groupFilter = convertToPagination({
    id: inputs.vocab_group_id,
    created_by: userId,
  })

  const existingRecord = await repoVocabGroup.get(groupFilter, t)

  if (O.isNone(existingRecord)) {
    return E.left(formatError(StatusCodes.BAD_REQUEST, 'BAD_REQUEST'))
  }

  await repoVocab.bulkInsert(
    inputs.data.map((item) => ({
      ...item,
      vocab_group_id: inputs.vocab_group_id,
      created_by: userId,
    })),
    t,
  )

  return E.right(undefined)
}
