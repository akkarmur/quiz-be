import Joi from 'joi'

export const sentOtpReqSchema = Joi.object({
  email: Joi.string().min(3).max(64).required(),
  device_id: Joi.string().min(3).required(),
})
