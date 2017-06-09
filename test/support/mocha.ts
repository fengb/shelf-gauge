import * as typeorm from "typeorm";
import * as sinon from "sinon";

declare module "mocha" {
  interface MochaExtensions {
    conn?: typeorm.Connection;
    sandbox: sinon.SinonSandbox;
  }

  interface IHookCallbackContext extends MochaExtensions {}
  interface ITestCallbackContext extends MochaExtensions {}
}

interface HookCallback {
  (this: Mocha.IHookCallbackContext): Promise<any> | any;
}

function callbackAll(trigger: (callback: HookCallback) => any) {
  let called = false;

  const callbacks = [] as HookCallback[];

  trigger(function() {
    called = true;
    return Promise.map(callbacks, cb => cb.call(this));
  });

  return function(callback: HookCallback) {
    if (called) {
      throw new Error("already called");
    }

    callbacks.push(callback);
  };
}

export const beforeAll = callbackAll(before);
export const afterAll = callbackAll(after);
