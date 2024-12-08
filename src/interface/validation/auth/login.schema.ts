import Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string().min(3).max(64).required(),
  password: Joi.string().min(6).required(),
  device_id: Joi.string().min(3).required(),
  device_token: Joi.string().min(3),
  os: Joi.string().required().min(1),
})
