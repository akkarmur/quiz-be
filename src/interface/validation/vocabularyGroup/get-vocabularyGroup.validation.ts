import * as Joi from 'joi'
import { searchStringValidation } from '../../../infrastructure/helpers/validator'
import { commonPaginationSchema } from '../common/pagination.schema'

export const getVocabularyGroupSchema = Joi.object({
  name: Joi.string().pattern(searchStringValidation()),
  description: Joi.string().pattern(searchStringValidation()),
  created_at: Joi.date(),
  updated_at: Joi.date(),
  get_all: Joi.string().valid('true', 'false'),
  ...commonPaginationSchema,
})
