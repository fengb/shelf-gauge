import * as cluster from 'cluster'
import * as control from 'strong-cluster-control'

control.start({
  size: control.CPUS,
})

if(cluster.isWorker) {
  require('./index')
}
