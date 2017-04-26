import './config/boot'

import env from './config/env'
import server from './lib/server'

server.listen(env.server.port, () => {
  console.log(`Started on port ${env.server.port}`)
})
