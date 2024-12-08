import { AsyncLocalStorage } from 'async_hooks'
import { Sequelize, Transaction } from 'sequelize'

import { env } from '../../env'
import logger from '../../helpers/logger'

// As per https://github.com/sequelize/sequelize/issues/11992
// This can will sequelize to re-connect on any of these errors.
const retry = {
  max: Infinity,
  report: (msg: string | object) => {
    logger.silly('Unable to connect to database; retrying.')
    if (JSON.stringify(msg).includes('Trying unknown #1')) {
      logger.silly(msg)
    } else {
      logger.debug(msg)
    }
  },
  match: [
    /ConnectionError/,
    /SequelizeConnectionError/,
    /SequelizeConnectionRefusedError/,
    /SequelizeHostNotFoundError/,
    /SequelizeHostNotReachableError/,
    /SequelizeInvalidConnectionError/,
    /SequelizeConnectionTimedOutError/,
    /SequelizeConnectionAcquireTimeoutError/,
    /Connection terminated unexpectedly/,
  ],
}

const dialectOptions = {
  charset: 'utf8mb4',
} as Record<string, any>

dialectOptions.ssl = {
  rejectUnauthorized: false,
}

export const sequelize: Sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PWD,
  {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    dialect: 'mysql',
    retry,
    logging: (msg) => logger.info(msg),
    dialectOptions,
  },
)
/**
 * Represents an instance of asynchronous local storage for storing transaction data.
 */
export const transactionStorage = new AsyncLocalStorage<{
  transaction: Transaction | null
}>()

/**
 * Retrieves the current transaction from the asynchronous local storage.
 * Throws an error if the transaction is not found or if the storage context is not available.
 */
export const getTransaction = (): Transaction => {
  // Retrieve the transaction from the async local storage
  const transaction = transactionStorage.getStore()?.transaction
  if (transaction === undefined || transaction === null) {
    throw new Error('not in async local storage context')
  }
  return transaction
}

/**
 * This function wraps the provided function in a transaction using Sequelize.
 * If there is no transaction in the async local storage, a new transaction is started.
 * If there is a transaction in the async local storage, that transaction is continued.
 */
export const wrapInTransaction = async <X>(
  fn: (transaction: Transaction) => Promise<X>,
): Promise<X> => {
  // Retrieve the transaction store from the async local storage
  const transactionStore = transactionStorage.getStore()
  if (transactionStore === undefined || transactionStore.transaction === null) {
    // There is no transaction in async local storage, so we just start a new tranaction like we did before.
    return sequelize.transaction(fn)
  }

  // There is a transaction in async local storage, so we take that and continue with it.
  return sequelize.transaction(
    { transaction: transactionStore.transaction },
    fn,
  )
}
