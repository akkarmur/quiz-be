import { Router } from 'express'

import { validation } from '../../infrastructure/helpers/validator'

import { env } from '../../infrastructure/env'
import { verifyJWTHS512Middleware } from '../../infrastructure/helpers/token/jwt-HS512.token'
import { getVocabularyController } from '../controller/vocabulary/get-vocabulary/get-vocabulary.controller'
import { insertVocabularyController } from '../controller/vocabulary/insert-vocabulary/insert-vocabulary.controller'
import { getVocabularySchema } from '../validation/vocabulary/get-vocabulary.validation'
import { insertVocabularySchema } from '../validation/vocabulary/insert-vocabulary.validation'

const route = Router()

/**
 * For getting vocabulary
 */
route.get('/', validation(getVocabularySchema), getVocabularyController)

route.post(
  '/',
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  validation(insertVocabularySchema),
  insertVocabularyController,
)

export const vocabularyRoute = route
