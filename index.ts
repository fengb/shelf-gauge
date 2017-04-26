import './config/boot'

import env from './config/env'
import app from './lib/server'

app.listen(env.server.port, () => {
  console.log(`Started on port ${env.server.port}`)
})
