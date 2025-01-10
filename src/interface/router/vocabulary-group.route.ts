import { Router } from 'express'

import { env } from '../../infrastructure/env'
import { verifyJWTHS512Middleware } from '../../infrastructure/helpers/token/jwt-HS512.token'
import { validation } from '../../infrastructure/helpers/validator'
import { deleteVocabularyGroupController } from '../controller/vocabulary-group/delete-vocabulary-group/delete-vocabulary-group.controller'
import { getVocabularyGroupController } from '../controller/vocabulary-group/get-vocabulary-group/get-vocabulary-group.controller'
import { insertVocabularyGroupController } from '../controller/vocabulary-group/insert-vocabulary-group/insert-vocabulary-group.controller'
import { updateVocabularyGroupController } from '../controller/vocabulary-group/update-vocabulary-group/update-vocabulary-group.controller'
import { deleteVocabularyGroupSchema } from '../validation/vocabulary-group/delete-vocabularyGroup.validation'
import { getVocabularyGroupSchema } from '../validation/vocabulary-group/get-vocabularyGroup.validation'
import { insertVocabularyGroupSchema } from '../validation/vocabulary-group/insert-vocabularyGroup.validation'
import { updateVocabularyGroupSchema } from '../validation/vocabulary-group/update-vocabularyGroup.validation'

const route = Router()

/**
 * For getting vocabulary
 */
route.get(
  '/',
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET, undefined, false),
  validation(getVocabularyGroupSchema),
  getVocabularyGroupController,
)

/**
 * For Insert vocabulary
 */
route.post(
  '/',
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  validation(insertVocabularyGroupSchema),
  insertVocabularyGroupController,
)

/**
 * For update vocabulary
 */
route.patch(
  '/',
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  validation(updateVocabularyGroupSchema),
  updateVocabularyGroupController,
)

/**
 * For delete vocabulary
 */
route.delete(
  '/',
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  validation(deleteVocabularyGroupSchema),
  deleteVocabularyGroupController,
)

export const vocabularyGroupRoute = route
