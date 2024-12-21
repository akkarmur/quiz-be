import Joi from 'joi'

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().min(3).max(64),
  password: Joi.string().min(6),
  device_id: Joi.string().min(3).required(),
  otp: Joi.string().length(6).required(),
})
