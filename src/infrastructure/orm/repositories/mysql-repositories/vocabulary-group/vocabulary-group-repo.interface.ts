import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { TokenDetails } from '../../../../../domain/entities/common/JWT'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { VocabularyGroupDB } from '../../../../../domain/entities/vocabularyGroup/get-voca-group.interface'
import { VocabularyGroupPostReqInner } from '../../../../../domain/entities/vocabularyGroup/insert-voca-group.interface'
import { VocabularyGroupPatchReqInner } from '../../../../../domain/entities/vocabularyGroup/update-voca-group.interface'

export interface VocabularyGroupRepoInterface {
  /**
   * Get vocabulary group list
   * @param paginationData pagination data
   * @param t transaction
   * @returns vocabulary group list
   */
  get(
    paginationData: Pagination,
    t: Transaction,
  ): Promise<O.Option<VocabularyGroupDB[]>>

  /**
   * Get vocabulary group count
   * @param paginationData pagination data
   * @param t transaction
   * @returns vocabulary group count
   */
  getCount(paginationData: Pagination, t: Transaction): Promise<number>

  /**
   * Insert vocabulary group
   * @param data vocabulary group post request
   * @param tokenDetails token details
   * @param t transaction
   */
  insert(
    data: VocabularyGroupPostReqInner,
    tokenDetails: TokenDetails,
    t: Transaction,
  ): Promise<void>

  /**
   * Update vocabulary group
   * @param data vocabulary group patch request
   * @param tokenDetails token details
   * @param t transaction
   * @returns affected row count
   */
  update(
    data: VocabularyGroupPatchReqInner,
    tokenDetails: TokenDetails,
    t: Transaction,
  ): Promise<number>

  /**
   * Delete vocabulary group
   * @param input vocabulary group delete request
   * @param t transaction
   * @returns affected row count
   */
  delete(
    input: { id: number; created_by?: number },
    t: Transaction,
  ): Promise<number>
}
