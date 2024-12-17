import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { Vocabulary200DataDataInner } from '../../../../../domain/entities/vocabulary/get/Vocabulary200DataDataInner'
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

  async insert(data: any, t): Promise<Vocabulary> {
    return await Vocabulary.create(data, { transaction: t })
  },

  update: async (input: Vocabulary, t: Transaction): Promise<number> => {
    const [affectedRowCount] = await Vocabulary.update(input, {
      where: {
        id: input.id,
      },
      transaction: t,
    })
    return affectedRowCount
  },

  delete: async (
    input: { id: number; is_active: boolean },
    t: Transaction,
  ): Promise<void> => {
    await Vocabulary.update(
      { is_active: input.is_active },
      {
        where: {
          id: input.id,
        },
        transaction: t,
      },
    )
  },
}
