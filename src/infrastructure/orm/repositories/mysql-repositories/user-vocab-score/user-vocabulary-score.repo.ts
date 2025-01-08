import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { UserVocabularyScoreInputs } from '../../../../../domain/entities/user-vocabulary-score/put-user-vocabulary-score.interface'
import { optionFormatForArray } from '../../../../helpers/fm-ts'
import UserVocabularyScore from '../../../sequelize/entities/t_user_vocabulary_score'
import { mysqlCommonRepo } from '../common/common.repo'
import { UserVocabScoreRepoInterface } from './user-vocabulary-score-repo.interface'

export const mysqlUserVocabularyScoreRepo: UserVocabScoreRepoInterface = {
  async get(
    paginationData: Pagination,
    t,
  ): Promise<O.Option<UserVocabularyScore[]>> {
    const { fields, order, limit, offset } = paginationData
    const where = mysqlCommonRepo.whereCondition(fields)
    const orderBy = mysqlCommonRepo.convertOrder(order)

    const data = await UserVocabularyScore.findAll({
      attributes: [
        'vocab_id',
        'attempt_count',
        'correct_count',
        'is_active',
        'created_at',
        'created_by',
        'updated_at',
      ],
      where,
      limit,
      offset,
      order: orderBy,
      transaction: t,
    })

    return optionFormatForArray(data)
  },

  async getCount(paginationData: Pagination, t): Promise<number> {
    const fields = paginationData.fields
    const where = mysqlCommonRepo.whereCondition(fields)

    const count = await UserVocabularyScore.count({
      where,
      transaction: t,
    })

    return count
  },
  async upsert(data: UserVocabularyScoreInputs, t: Transaction): Promise<void> {
    await UserVocabularyScore.upsert({ ...data }, { transaction: t })
  },
}
