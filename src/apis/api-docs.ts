import fs from 'node:fs'

import Express from 'express'
import type { JsonObject } from 'swagger-ui-express'
import swaggerUI from 'swagger-ui-express'

import { env } from '../infrastructure/env'

/**
 * This function returns the main router with the API documentation route.
 *
 * @param {Express.Router} router The main Express router.
 * @returns {Express.Router} The main router with the API documentation route.
 */
export const apiDocs = (router: Express.Router): Express.Router => {
  const openAPIJsonFile = 'api-docs/_openapi.json'

  // If production swagger will not display
  if (env.NODE_ENV === 'production') {
    return router
  }

  /**
   * Serves static swagger.json file
   */
  const swaggerDocument = JSON.parse(
    fs.readFileSync(openAPIJsonFile, 'utf8'),
  ) as JsonObject

  /**
   * Serves Swagger UI
   */
  router.use('/api-docs/openapi.json', Express.static(openAPIJsonFile))
  router.use('/api-docs', swaggerUI.serve)
  router.get('/api-docs', swaggerUI.setup(swaggerDocument))
  return router
}
