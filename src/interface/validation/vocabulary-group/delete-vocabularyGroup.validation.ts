import * as Joi from 'joi'

export const deleteVocabularyGroupSchema = Joi.object({
  id: Joi.number().required(),
})
