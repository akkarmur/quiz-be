import * as Joi from 'joi'
import { searchStringValidation } from '../../../infrastructure/helpers/validator'
import { commonPaginationSchema } from '../common/pagination.schema'

export const getVocabularyGroupSchema = Joi.object({
  name: Joi.string().pattern(searchStringValidation()),
  description: Joi.string().pattern(searchStringValidation()),
  is_public: Joi.string(),
  created_at: Joi.date(),
  updated_at: Joi.date(),
  ...commonPaginationSchema,
})
