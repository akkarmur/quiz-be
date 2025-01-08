import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { convertToPagination } from '../../../../domain/entities/common/pagination'
import {
  UserVocabularyScoreInputs,
  UserVocabularyScorePutReqInner,
} from '../../../../domain/entities/user-vocabulary-score/put-user-vocabulary-score.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { UserVocabScoreRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/user-vocab-score/user-vocabulary-score-repo.interface'

export const putUserVocabularyScoreUseCase = async (
  data: UserVocabularyScorePutReqInner,
  repo: UserVocabScoreRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, void>> => {
  const userVocabularyScoreInputs = convertToPagination({
    vocab_id: data.vocab_id,
    created_by: data.created_by,
  })
  const userVocabularyScore = await repo.get(userVocabularyScoreInputs, t)
  let userVocabularyScoreData: UserVocabularyScoreInputs = {
    vocab_id: data.vocab_id,
    attempt_count: 1,
    correct_count: data.is_correct ? 1 : 0,
    created_by: data.created_by,
    updated_by: data.created_by,
  }
  if (O.isSome(userVocabularyScore)) {
    userVocabularyScoreData = {
      vocab_id: data.vocab_id,
      attempt_count: userVocabularyScore.value[0].attempt_count + 1,
      correct_count:
        userVocabularyScore.value[0].correct_count + (data.is_correct ? 1 : 0),
      created_by: data.created_by,
      updated_by: data.created_by,
    }
  }
  const insertedRecord = await repo.upsert(userVocabularyScoreData, t)
  return E.right(insertedRecord)
}
