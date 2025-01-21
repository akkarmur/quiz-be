import * as Joi from 'joi'

export const updateVocabularyGroupSchema = Joi.object({
  id: Joi.number().required().description('VocabularyGroup ID'),
  name: Joi.string().optional().description('VocabularyGroup name'),
  description: Joi.string()
    .optional()
    .description('VocabularyGroup description'),
})
