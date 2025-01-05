const Joi = require('joi')

export const insertVocabularySchema = Joi.object({
  vocab_group_id: Joi.number().integer().required(),
  data: Joi.array()
    .items(
      Joi.object({
        word: Joi.string().max(64).required(), // Matches varchar(64)
        language: Joi.string().max(64).required(), // Matches varchar(64)
        note_word: Joi.string().max(64).allow(null, ''), // Matches varchar(64), optional
        meaning: Joi.string().max(64).required(), // Matches varchar(64)
        pronunciation: Joi.string().max(64).required(), // Matches varchar(64)
        note_meaning: Joi.string().max(64).allow(null, ''), // Matches varchar(64), optional
        level: Joi.number().integer().max(2147483647).allow(null), // Matches int
        type: Joi.string().max(64).allow(null, ''), // Matches varchar(64), optional
      }).required(),
    )
    .required(),
})
