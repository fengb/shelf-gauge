import * as cluster from 'cluster'
import * as control from 'strong-cluster-control'

import ENV from './config/env'

control.start({
  size: ENV.server.clusterSize,
})

if(cluster.isWorker) {
  require('./index')
}
