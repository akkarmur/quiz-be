import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { TokenDetails } from '../../../../../domain/entities/common/JWT'
import { Pagination } from '../../../../../domain/entities/common/pagination'
import { VocabularyGroupDB } from '../../../../../domain/entities/vocabularyGroup/get-voca-group.interface'
import { VocabularyGroupPostReqInner } from '../../../../../domain/entities/vocabularyGroup/insert-voca-group.interface'
import { VocabularyGroupPatchReqInner } from '../../../../../domain/entities/vocabularyGroup/update-voca-group.interface'
import { optionFormatForArray } from '../../../../helpers/fm-ts'
import VocabularyGroup from '../../../sequelize/entities/t_vocabulary_group'
import { mysqlCommonRepo } from '../common/common.repo'
import { VocabularyGroupRepoInterface } from './vocabulary-group-repo.interface'

export const mysqlVocabularyGroupRepo: VocabularyGroupRepoInterface = {
  /**
   * Retrieves a list of vocabulary groups from the database
   * @param paginationData The pagination data to be used for the query
   * @param t The transaction instance
   * @returns A promise that resolves to an array of vocabulary group objects
   */
  async get(
    paginationData: Pagination,
    t,
  ): Promise<O.Option<VocabularyGroupDB[]>> {
    const { fields, order, limit, offset } = paginationData
    const where = mysqlCommonRepo.whereCondition(fields)
    const orderBy = mysqlCommonRepo.convertOrder(order)

    // Retrieve the list of vocabulary groups from the database
    const data = await VocabularyGroup.findAll({
      attributes: [
        'id',
        'name',
        'description',
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

    // Format the returned data into an array of VocabularyGroup objects
    return optionFormatForArray(data)
  },

  /**
   * Retrieves the count of vocabulary groups from the database
   * @param paginationData The pagination data to be used for the query
   * @param t The transaction instance
   * @returns A promise that resolves to the count of vocabulary groups
   */
  async getCount(paginationData: Pagination, t): Promise<number> {
    // Extract the fields from the pagination data
    const fields = paginationData.fields

    // Convert the fields to a Sequelize where condition
    const where = mysqlCommonRepo.whereCondition(fields)

    // Retrieve the count of vocabulary groups from the database
    const count = await VocabularyGroup.count({
      // Use the converted where condition for the query
      where,
      // Use the provided transaction instance
      transaction: t,
    })

    // Return the count of vocabulary groups
    return count
  },

  /**
   * Inserts a new vocabulary group into the database
   * @param data The vocabulary group post request data
   * @param tokenDetails The token details of the user performing the action
   * @param t The transaction instance
   * @returns A promise that resolves to nothing
   */
  async insert(
    data: VocabularyGroupPostReqInner,
    tokenDetails: TokenDetails,
    t: Transaction,
  ): Promise<void> {
    // Create a new VocabularyGroup instance in the database
    await VocabularyGroup.create(
      // Use the provided data and add the created_by field with the user's id
      { ...data, created_by: tokenDetails.id },
      // Use the provided transaction instance
      { transaction: t },
    )
  },

  /**
   * Updates a vocabulary group record in the database
   * @param data The vocabulary group patch request data
   * @param tokenDetails The token details of the user performing the action
   * @param t The transaction instance
   * @returns A promise that resolves to the count of affected rows
   */
  async update(
    data: VocabularyGroupPatchReqInner,
    tokenDetails: TokenDetails,
    t: Transaction,
  ): Promise<number> {
    // Update the vocabulary group record in the database
    const [affectedRowCount] = await VocabularyGroup.update(
      // Use the provided data and add the updated_by field with the user's id
      { ...data, updated_by: tokenDetails.id },
      // Use the provided transaction instance
      {
        // Use the id field from the provided data as the condition for the update
        where: {
          id: data.id,
        },
        transaction: t,
      },
    )

    // Return the count of affected rows
    return affectedRowCount
  },

  /**
   * Deletes a vocabulary group record from the database
   * @param input The vocabulary group delete request data
   * @param t The transaction instance
   * @returns A promise that resolves to the count of affected rows
   */
  async delete(
    input: { id: number; created_by?: number },
    t: Transaction,
  ): Promise<number> {
    // Delete the vocabulary group record from the database
    const affectedRowCount = await VocabularyGroup.destroy({
      // Use the provided data as the condition for the delete
      where: {
        ...input,
      },
      // Use the provided transaction instance
      transaction: t,
    })
    // Return the count of affected rows
    return affectedRowCount
  },
}
