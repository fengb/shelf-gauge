import * as chai from 'chai'

import subset = require('chai-subset')
chai.use(subset)

import chaiHttp = require('chai-http')
chai.use(chaiHttp)

export default chai
export const { expect } = chai
