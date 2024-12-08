import { createServer } from './src/infrastructure/webserver/express'
;(async () => {
  // Start the Express server
  await createServer()
})()
