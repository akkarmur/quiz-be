import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { UserVocabularyScoreInputs } from '../../../../../domain/entities/user-vocabulary-score/put-user-vocabulary-score.interface'
import UserVocabularyScore from '../../../sequelize/entities/t_user_vocabulary_score'

export interface UserVocabScoreRepoInterface {
  get: (
    paginationData: Pagination,
    t: Transaction,
  ) => Promise<O.Option<UserVocabularyScore[]>>
  getCount: (paginationData: Pagination, t: Transaction) => Promise<number>
  upsert(data: UserVocabularyScoreInputs, t: Transaction): Promise<void>
}
