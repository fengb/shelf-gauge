import { Repo } from 'lib/entity'
import Serializer from 'lib/util/serializer'

export default new Serializer(Repo, {
  url: Serializer.String,
  name: Serializer.String,
})