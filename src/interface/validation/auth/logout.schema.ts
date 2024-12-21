import Joi from 'joi'

export const logoutSchema = Joi.object({
  device_id: Joi.string().min(3).required(),
})
