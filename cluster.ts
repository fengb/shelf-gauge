import * as cluster from 'cluster'
import * as control from 'strong-cluster-control'

control.start({
  size: Math.max(control.CPUS, 2),
})

if(cluster.isWorker) {
  require('./index')
}
