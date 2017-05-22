import { Repo } from 'src/entity'
import * as Serializer from 'src/util/serializer'

export default Serializer.object(Repo, {
  url: Serializer.string(),
  source: Serializer.string<Repo.Source>(),
  name: Serializer.string(),
})
