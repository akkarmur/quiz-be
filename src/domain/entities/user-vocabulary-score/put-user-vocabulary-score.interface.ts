import UserVocabularyScore from '../../../infrastructure/orm/sequelize/entities/t_user_vocabulary_score'

export type UserVocabularyScorePutReqInner = {
  vocab_id: number
  is_correct: boolean
  created_by: number
}

export type UserVocabularyScoreInputs = Pick<
  UserVocabularyScore,
  'vocab_id' | 'attempt_count' | 'correct_count' | 'created_by' | 'updated_by'
>
