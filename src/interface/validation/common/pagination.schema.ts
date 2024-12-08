import Joi from 'joi'

export const commonPaginationSchema = {
  id: Joi.number().integer(),
  limit: Joi.number().integer(),
  offset: Joi.number().integer(),
}
