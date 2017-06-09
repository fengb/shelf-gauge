import * as chai from "chai";

import subset = require("chai-subset");
import chaiHttp = require("chai-http");
import sinon = require("sinon-chai");

export default chai.use(subset).use(chaiHttp).use(sinon);

export const { expect } = chai;
