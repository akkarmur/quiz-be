import Joi from 'joi'

import { searchStringValidation } from '../../../infrastructure/helpers/validator'
import { commonPaginationSchema } from '../common/pagination.schema'

export const getUserSchema = Joi.object({
  name: Joi.string().pattern(searchStringValidation()),
  email: Joi.string().min(3).max(64),
  created_at: Joi.date(),
  updated_at: Joi.date(),
  get_all: Joi.string().valid('true', 'false'),
  ...commonPaginationSchema,
})
