import * as Joi from 'joi'

export const insertVocabularyGroupSchema = Joi.object({
  name: Joi.string().required().description('VocabularyGroup name'),
  description: Joi.string()
    .optional()
    .description('VocabularyGroup description'),
})
