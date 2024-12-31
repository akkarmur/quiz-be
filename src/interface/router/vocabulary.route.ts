import { Router } from 'express'

import { validation } from '../../infrastructure/helpers/validator'

import multer from 'multer'
import { env } from '../../infrastructure/env'
import { verifyJWTHS512Middleware } from '../../infrastructure/helpers/token/jwt-HS512.token'
import { deleteVocabularyController } from '../controller/vocabulary/delete-vocabulary/delete-vocabulary.controller'
import { getVocabularyController } from '../controller/vocabulary/get-vocabulary/get-vocabulary.controller'
import { insertVocabularyController } from '../controller/vocabulary/insert-vocabulary/insert-vocabulary.controller'
import { updateVocabularyController } from '../controller/vocabulary/update-vocabulary/update-vocabulary.controller'
import { deleteVocabularySchema } from '../validation/vocabulary/delete-vocabulary.validation'
import { getVocabularySchema } from '../validation/vocabulary/get-vocabulary.validation'
import { insertVocabularySchema } from '../validation/vocabulary/insert-vocabulary.validation'
import { updateVocabularySchema } from '../validation/vocabulary/update-vocabulary.validation'

const route = Router()
const upload = multer()

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

route.patch(
  '/',
  upload.single('image'),
  validation(updateVocabularySchema, 'formData'),
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  updateVocabularyController,
)

route.delete(
  '/',
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  validation(deleteVocabularySchema),
  deleteVocabularyController,
)

export const vocabularyRoute = route
