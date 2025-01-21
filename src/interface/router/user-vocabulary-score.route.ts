import { Router } from 'express'

import { env } from '../../infrastructure/env'
import { verifyJWTHS512Middleware } from '../../infrastructure/helpers/token/jwt-HS512.token'
import { validation } from '../../infrastructure/helpers/validator'
import { putUserVocabularyScoreController } from '../controller/user-vocabulary-score/put-user-vocabulary-score/put-user-vocabulary-score.controller'
import { putUserVocabularyScoreSchema } from '../validation/user-vocabulary-score/put-user-vocabulary-score.validation'

const route = Router()

/**
 * For update user vocabulary score
 */
route.put(
  '/',
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  validation(putUserVocabularyScoreSchema),
  putUserVocabularyScoreController,
)

export const userVocabularyScoreRoute = route
