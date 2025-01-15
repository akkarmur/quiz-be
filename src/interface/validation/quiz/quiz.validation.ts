import * as Joi from 'joi'
import {
  orderByValidationRegExp,
  searchNumberValidation,
  searchStringValidation,
} from '../../../infrastructure/helpers/validator'
import { commonPaginationSchema } from '../common/pagination.schema'

const orderByFields = ['id', 'vocab_group_id', 'created_at', 'updated_at']

/**
 * Validation schema for fetching Vocabulary.
 * This schema includes pagination, filtering, and optional flags.
 */
export const quizSchema = Joi.object({
  level: Joi.string().pattern(searchStringValidation()),
  type: Joi.string().pattern(searchStringValidation()),
  quiz_type: Joi.string().pattern(searchStringValidation()),
  vocab_group_id: Joi.string().pattern(searchStringValidation()),
  score: Joi.string().pattern(searchNumberValidation()),
  attempt_count: Joi.string().pattern(searchNumberValidation()),
  order: Joi.alternatives(
    Joi.string().pattern(orderByValidationRegExp(orderByFields)),
    Joi.array().items(
      Joi.string().pattern(orderByValidationRegExp(orderByFields)),
    ),
  ),
  ...commonPaginationSchema,
})
