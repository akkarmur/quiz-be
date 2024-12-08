import Joi from 'joi'

import { CONSTANTS } from '../../../infrastructure/configs/constants/constants'

export const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.object({
    size: Joi.number().max(CONSTANTS.DEFAULT_VALUES.IMAGE_SIZE),
    mimetype: Joi.string().regex(/^image\//),
  }).unknown(true),
})
