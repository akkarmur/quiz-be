import { Router, static as static_ } from 'express'

import { env } from '../infrastructure/env'
import { errorResponse } from '../infrastructure/helpers/res'
import { authRoute } from '../interface/router/auth.route'
import { userRoute } from '../interface/router/user.route'
import { vocabularyRoute } from '../interface/router/vocabulary.route'
import { apiDocs } from './api-docs'

/**
 * V1 routes
 *
 * This function returns the main router for the V1 API routes.
 *
 * @returns {Router} The main router for the V1 API routes.
 */
export function path(): Router {
  const router = Router()

  // Add API documentation
  apiDocs(router)

  // Serve images
  router.use('/images', static_(env.IMG_BASE_PATH))

  // Add routes for authentication and users
  router.use('/auth', authRoute)
  router.use('/user', userRoute)
  router.use('/vocabulary', vocabularyRoute)

  // Add middleware to handle errors
  router.use(errorResponse)

  return router
}
