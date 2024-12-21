import Joi from 'joi'

export const refreshTokenSchema = Joi.object({
  device_id: Joi.string().min(3).required(),
})
