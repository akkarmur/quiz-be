import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { Vocabulary200DataDataInner } from '../../../../../domain/entities/vocabulary/get/Vocabulary200DataDataInner'
import Vocabulary from '../../../../../infrastructure/orm/sequelize/entities/t_vocabulary'

export interface VocabularyRepoInterface {
  get(
    paginationData: Pagination,
    t: Transaction,
  ): Promise<O.Option<Vocabulary200DataDataInner[]>>
  getCount(paginationData: Pagination, t: Transaction): Promise<number>
  insert(data: Vocabulary, t: Transaction): Promise<Vocabulary>
  update(data: Vocabulary, t: Transaction): Promise<number>
  delete(
    input: { id: number; is_active: boolean },
    t: Transaction,
  ): Promise<void>
}
