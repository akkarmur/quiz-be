const Joi = require('joi')

export const putUserVocabularyScoreSchema = Joi.object({
  vocab_id: Joi.number().integer().required(),
  is_correct: Joi.boolean().required(),
})
