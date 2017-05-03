import './config/boot'

import ENV from './config/env'
import server from './lib/server'

server.listen(ENV.server.port, () => {
  console.log(`Started on port ${ENV.server.port}`)
})
