import { Router } from 'express'

import { validation } from '../../infrastructure/helpers/validator'

import { getVocabularyController } from '../controller/vocabulary/get-vocabulary/get-vocabulary.controller'
import { getVocabularySchema } from '../validation/vocabulary/get-vocabulary.validation'

const route = Router()

/**
 * For getting vocabulary
 */
route.get('/', validation(getVocabularySchema), getVocabularyController)

export const vocabularyRoute = route
