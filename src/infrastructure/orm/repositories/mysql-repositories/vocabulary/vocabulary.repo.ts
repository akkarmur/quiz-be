import * as O from 'fp-ts/Option'
import { Optional, Transaction } from 'sequelize'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { Vocabulary200DataDataInner } from '../../../../../domain/entities/vocabulary/get-vocabulary.interface'
import { VocabularyPostReqInner } from '../../../../../domain/entities/vocabulary/insert-vocabulary.interface'
import { VocabularyPatchReqInner } from '../../../../../domain/entities/vocabulary/update-vocabulary.interface'
import { optionFormatForArray } from '../../../../helpers/fm-ts'
import Vocabulary from '../../../sequelize/entities/t_vocabulary'
import { mysqlCommonRepo } from '../common/common.repo'
import { VocabularyRepoInterface } from './vocabulary-repo.interface'

export const mysqlVocabularyRepo: VocabularyRepoInterface = {
  async get(
    paginationData: Pagination,
    t,
  ): Promise<O.Option<Vocabulary200DataDataInner[]>> {
    const { fields, order, limit, offset } = paginationData
    const where = mysqlCommonRepo.whereCondition(fields)
    const orderBy = mysqlCommonRepo.convertOrder(order)

    const data = await Vocabulary.findAll({
      attributes: [
        'id',
        'vocab_group_id',
        'word',
        'language',
        'note_word',
        'image',
        'meaning',
        'pronunciation',
        'note_meaning',
        'level',
        'type',
        'is_active',
        'created_at',
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
    const where = mysqlCommonRepo.whereCondition(paginationData.fields)
    const count = await Vocabulary.count({ where, transaction: t })
    return count
  },

  async bulkInsert(data: VocabularyPostReqInner[], t): Promise<void> {
    await Vocabulary.bulkCreate(
      data as Optional<Vocabulary, keyof Vocabulary>[],
      { transaction: t },
    )
  },

  async update(data: VocabularyPatchReqInner, t): Promise<number> {
    const [affectedRowCount] = await Vocabulary.update(
      { ...data },
      {
        where: {
          id: data.id,
        },
        transaction: t,
      },
    )

    // Return the count of affected rows
    return affectedRowCount
  },

  async delete(
    input: { id: number; created_by?: number },
    t: Transaction,
  ): Promise<number> {
    const count = await Vocabulary.destroy({
      where: {
        ...input,
      },
      transaction: t,
    })
    return count
  },
}
