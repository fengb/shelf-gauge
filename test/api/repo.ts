import { expect, request, HttpStatus } from 'test/support'

describe('API /repo', () => {
  describe('/:repoOrg/:repoName PUT', () => {
    it('returns status created', async () => {
      const response = await request()
                             .put('/repo/foo/bar')
                             .send({})
      console.warn(response.body)
    })
  })
})
