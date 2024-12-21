import Joi from 'joi'

export const putGuestUserSchema = Joi.object({
  device_id: Joi.string().min(3).required(),
  device_token: Joi.string().min(3),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  os: Joi.string().min(1),
})
