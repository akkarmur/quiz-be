import Joi from 'joi'

export const registrationSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().min(3).max(64).required(),
  password: Joi.string().min(6).required(),
  device_id: Joi.string().min(3).required(),
  otp: Joi.string().length(6).required(),
  device_token: Joi.string().min(3),
  os: Joi.string().required().min(1),
})
