import cors from 'cors'
import express from 'express'
import { ConfigurationOptions, I18n } from 'i18n'

import { LoggerStream } from '../../../infrastructure/helpers/logger'
import EN from '../../configs/language/en'
import GU from '../../configs/language/gu'
import HI from '../../configs/language/hi'
import { env } from '../../env'
import { sequelize } from '../../orm/sequelize'

/**
 * Creates an Express server and returns it.
 *
 * @returns {Express.Application} Server application
 */
export const createServer = (): Express.Application => {
  const app = express()

  /**
   * CORS settings
   *
   * @type {cors.CorsOptions} CORS options
   */
  const options: cors.CorsOptions = {
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }

  /**
   * Adds CORS headers to the response
   *
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @param {NextFunction} next - Next function
   */
  app.use(cors(options))

  /**
   * Adds headers to the response
   *
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @param {NextFunction} next - Next function
   */
  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Request methods you wish to allow
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    )

    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type, X-Ad-Token, X-Test',
    )

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 1)

    // Pass to next layer of middleware
    next()
  })

  /**
   * Adds body parsing middleware
   *
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @param {NextFunction} next - Next function
   */
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  /**
   * Adds i18n middleware
   *
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @param {NextFunction} next - Next function
   */
  const i18n = new I18n()
  i18n.configure({
    staticCatalog: {
      en: EN,
      gu: GU,
      hi: HI,
    },
    defaultLocale: 'en',
  } as ConfigurationOptions)
  app.use(i18n.init)

  /**
   * Syncs the database
   *
   * If the SEQUELIZE_SYNCHRONIZE environment variable is set to true, this method
   * will synchronize the database with the Sequelize models. This will create the
   * tables if they don't exist.
   *
   * @returns {Promise<void>} Promise
   */
  const sync = async () => {
    if (env.SEQUELIZE_SYNCHRONIZE) {
      /**
       * Synchronizes the database with the Sequelize models
       *
       * @returns {Promise<void>} Promise
       */
      await sequelize.sync()
    }
  }

  /**
   * Starts the Express server on the specified port.
   *
   * @param {number} port - The port number on which the server will listen.
   */
  const listen = (port: number): void => {
    app.listen(port, () => {
      // Log a message indicating the server is running and the port it's listening on
      LoggerStream.write(`Server app listening at http://localhost:${port}`)
    })
  }

  sync()
  listen(env.APPSERVER_PORT || 3000)

  return app
}
