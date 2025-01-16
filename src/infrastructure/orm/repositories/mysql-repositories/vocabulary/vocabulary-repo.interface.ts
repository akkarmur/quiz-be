import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { IVocabulary } from '../../../../../domain/entities/vocabulary/get-vocabulary.interface'
import { VocabularyPostReqInnerData } from '../../../../../domain/entities/vocabulary/insert-vocabulary.interface'
import { VocabularyPatchReqInner } from '../../../../../domain/entities/vocabulary/update-vocabulary.interface'
import Vocabulary from '../../../sequelize/entities/t_vocabulary'

export interface VocabularyRepoInterface {
  get(
    paginationData: Pagination,
    t: Transaction,
    is_random?: boolean,
  ): Promise<O.Option<IVocabulary[]>>
  getCount(paginationData: Pagination, t: Transaction): Promise<number>
  bulkInsert(
    inputs: VocabularyPostReqInnerData[],
    t: Transaction,
  ): Promise<void>
  update(inputs: VocabularyPatchReqInner, t: Transaction): Promise<number>
  delete(
    input: { id: number; created_by?: number },
    t: Transaction,
  ): Promise<number>

  getLevel(
    paginationData: Pagination,
    t: Transaction,
  ): Promise<O.Option<Vocabulary[]>>

  getOption(
    type: string[],
    vocab_group_id: number[],
    t: Transaction,
    is_random?: boolean,
  ): Promise<O.Option<Vocabulary[]>>
}
