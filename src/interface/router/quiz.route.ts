import { Router } from 'express'

import { env } from '../../infrastructure/env'
import { verifyJWTHS512Middleware } from '../../infrastructure/helpers/token/jwt-HS512.token'
import { validation } from '../../infrastructure/helpers/validator'
import { getQuizController } from '../controller/quiz/get-quiz.controller'
import { quizSchema } from '../validation/quiz/quiz.validation'

const route = Router()

/**
 * For getting quiz
 */
route.get(
  '/',
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  validation(quizSchema),
  getQuizController,
)

export const quizRoute = route
