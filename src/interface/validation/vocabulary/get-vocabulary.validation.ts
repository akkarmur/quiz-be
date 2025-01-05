import * as Joi from 'joi'
import {
  orderByValidationRegExp,
  searchStringValidation,
} from '../../../infrastructure/helpers/validator'
import { commonPaginationSchema } from '../common/pagination.schema'

const orderByFields = [
  'id',
  'word',
  'language',
  'level',
  'type',
  'vocab_group_id',
  'created_at',
  'updated_at',
]

/**
 * Validation schema for fetching Vocabulary.
 * This schema includes pagination, filtering, and optional flags.
 */
export const getVocabularySchema = Joi.object({
  word: Joi.string().pattern(searchStringValidation()),
  language: Joi.string().pattern(searchStringValidation()),
  level: Joi.string().pattern(searchStringValidation()),
  type: Joi.string().pattern(searchStringValidation()),
  vocab_group_id: Joi.string().pattern(searchStringValidation()),
  order: Joi.alternatives(
    Joi.string().pattern(orderByValidationRegExp(orderByFields)),
    Joi.array().items(
      Joi.string().pattern(orderByValidationRegExp(orderByFields)),
    ),
  ),
  ...commonPaginationSchema,
})
