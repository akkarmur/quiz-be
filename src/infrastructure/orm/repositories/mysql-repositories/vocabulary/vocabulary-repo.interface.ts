import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { Vocabulary200DataDataInner } from '../../../../../domain/entities/vocabulary/get-vocabulary.interface'
import { VocabularyPostReqInnerData } from '../../../../../domain/entities/vocabulary/insert-vocabulary.interface'

export interface VocabularyRepoInterface {
  get(
    paginationData: Pagination,
    t: Transaction,
  ): Promise<O.Option<Vocabulary200DataDataInner[]>>
  getCount(paginationData: Pagination, t: Transaction): Promise<number>
  bulkInsert(
    inputs: VocabularyPostReqInnerData[],
    t: Transaction,
  ): Promise<void>
  delete(
    input: { id: number; created_by?: number },
    t: Transaction,
  ): Promise<number>
}
