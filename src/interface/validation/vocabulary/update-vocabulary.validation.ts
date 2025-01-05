import { CONSTANTS } from '../../../infrastructure/configs/constants/constants'

const Joi = require('joi')

export const updateVocabularySchema = Joi.object({
  id: Joi.number().integer().required(),
  word: Joi.string().max(64).required(), // Matches varchar(64)
  language: Joi.string().max(64).optional(), // Matches varchar(64)
  note_word: Joi.string().max(64).allow(null, ''), // Matches varchar(64), optional
  meaning: Joi.string().max(64).optional(), // Matches varchar(64)
  pronunciation: Joi.string().max(64).optional(), // Matches varchar(64)
  note_meaning: Joi.string().max(64).allow(null, ''), // Matches varchar(64), optional
  level: Joi.number().integer().allow(null), // Matches int
  type: Joi.string().max(64).allow(null, ''), // Matches varchar(64), optional
  image: Joi.object({
    size: Joi.number().max(CONSTANTS.DEFAULT_VALUES.IMAGE_SIZE).required(),
    mimetype: Joi.string()
      .regex(/^image\//)
      .required(),
  })
    .unknown(true)
    .optional(),
})
