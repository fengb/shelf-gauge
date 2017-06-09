import githubStub from "./github";

export default function stub(sinon: sinon.SinonSandbox) {
  return {
    github: githubStub(sinon)
  };
}
