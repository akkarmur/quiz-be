import winston, { format } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import { env } from '../../env'
const transports: Array<winston.transport> = []

// Add console transport conditionally
if (env.NODE_ENV === 'production') {
  transports.push(
    new DailyRotateFile({
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  )
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
      ),
    }),
  )
}

const logger: winston.Logger = winston.createLogger({
  level: 'debug',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  silent: false,
  transports,
})

export const LoggerStream = {
  write: (msg: string): void => {
    logger.info(msg.replace(/(\n)/gm, ''))
  },
}

export default logger
