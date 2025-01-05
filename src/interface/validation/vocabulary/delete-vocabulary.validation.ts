import * as Joi from 'joi'

export const deleteVocabularySchema = Joi.object({
  id: Joi.number().required(),
})
