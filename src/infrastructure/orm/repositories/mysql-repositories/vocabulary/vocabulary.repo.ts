import * as O from 'fp-ts/Option'
import { Op, Optional, Sequelize, Transaction } from 'sequelize'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { IVocabulary } from '../../../../../domain/entities/vocabulary/get-vocabulary.interface'
import { VocabularyPostReqInner } from '../../../../../domain/entities/vocabulary/insert-vocabulary.interface'
import { VocabularyPatchReqInner } from '../../../../../domain/entities/vocabulary/update-vocabulary.interface'
import { optionFormatForArray } from '../../../../helpers/fm-ts'
import UserVocabularyScore from '../../../sequelize/entities/t_user_vocabulary_score'
import Vocabulary from '../../../sequelize/entities/t_vocabulary'
import VocabularyGroup from '../../../sequelize/entities/t_vocabulary_group'
import { mysqlCommonRepo, operationMap } from '../common/common.repo'
import { VocabularyRepoInterface } from './vocabulary-repo.interface'

export const mysqlVocabularyRepo: VocabularyRepoInterface = {
  async get(
    paginationData: Pagination,
    t,
    is_random?: boolean,
  ): Promise<O.Option<IVocabulary[]>> {
    const { fields, order, limit, offset } = paginationData

    // Utility function to filter fields
    const filterFields = (names: string[], include = true) =>
      fields?.filter((field) =>
        include ? names.includes(field.name) : !names.includes(field.name),
      )

    // Create where conditions
    const where = mysqlCommonRepo.whereCondition(
      filterFields(['attempt_count', 'score', 'created_by'], false),
    )
    const whereForUserVocab = mysqlCommonRepo.whereCondition(
      filterFields(['attempt_count', 'created_by']),
    )
    const whereForUserCreated = mysqlCommonRepo.whereCondition(
      filterFields(['created_by']),
      'skip',
    )

    // Find specific field conditions
    const whereScore = fields?.find((field) => field.name === 'score')
    const whereAttempt = fields?.find((field) => field.name === 'attempt_count')

    // Build the orderBy clause
    const orderBy = mysqlCommonRepo.convertOrder(order)

    // Fetch data with improved query
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
      include: [
        {
          model: UserVocabularyScore,
          as: 'user_scores',
          attributes: [
            [
              Sequelize.literal('(correct_count / attempt_count * 100)'),
              'score',
            ],
            'attempt_count',
            'created_by',
          ],
          where: {
            ...whereForUserVocab,
            ...(whereScore
              ? {
                  [Op.and]: Sequelize.where(
                    Sequelize.literal(
                      '(COALESCE(correct_count, 0) / COALESCE(attempt_count, 1) * 100)',
                    ),
                    operationMap[whereScore.operation],
                    whereScore.value,
                  ),
                }
              : {}),
          },
          required: !!(whereScore || whereAttempt),
        },
        {
          model: VocabularyGroup,
          attributes: [],
          where: {
            [Op.or]: [{ ...whereForUserCreated }, { is_public: true }],
          },
          required: true,
        },
      ],
      where,
      limit,
      offset,
      order:
        is_random && !orderBy?.length ? Sequelize.literal('RAND()') : orderBy,
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

  async getLevel(
    paginationData: Pagination,
    t,
  ): Promise<O.Option<Vocabulary[]>> {
    const { fields, limit, offset } = paginationData
    const where = mysqlCommonRepo.whereCondition(
      fields?.filter((field) => field.name !== 'created_by'),
    )

    const whereForUserCreated = mysqlCommonRepo.whereCondition(
      fields?.filter((field) => field.name === 'created_by'),
      'skip',
    )

    const data = await Vocabulary.findAll({
      attributes: [[Sequelize.literal('DISTINCT level'), 'level']],
      include: [
        {
          model: VocabularyGroup,
          attributes: [],
          where: {
            [Op.or]: [{ is_public: true }, whereForUserCreated],
          },
          required: true,
        },
      ],
      group: ['Vocabulary.level'],
      where,
      limit,
      offset,
      transaction: t,
    })

    return optionFormatForArray(data)
  },

  async getOption(
    type: string[],
    vocab_group_id: number[],
    t,
    is_random?: boolean,
  ): Promise<O.Option<Vocabulary[]>> {
    const data = await Vocabulary.findAll({
      attributes: ['type', 'word', 'note_word', 'meaning', 'note_meaning'],
      where: {
        type: {
          [Op.in]: type,
        },
        is_active: true,
        vocab_group_id: {
          [Op.in]: vocab_group_id,
        },
      },
      order: is_random ? Sequelize.literal('RAND()') : [],
      transaction: t,
    })

    return optionFormatForArray(data)
  },
}
