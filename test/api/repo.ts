import { expect, request, db, HttpStatus } from 'test/support'

describe('API /repo', () => {
  db.setup()

  describe('/:repoOrg/:repoName PUT', () => {
    it('returns status created', async () => {
      const response = await request()
                             .put('/repo/foo/bar')
                             .send({})
      console.warn(response.body)
    })
  })
})
