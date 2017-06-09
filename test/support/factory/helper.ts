import { sample } from "lodash";
import * as faker from "faker";

import {
  Builder,
  Constructor,
  build,
  define as factoryDefine
} from "./factory";
import { connect } from "../db";

export { build, faker };

export function randomize<T>(...values: T[]) {
  return () => sample(values);
}

export function sequence(val = 0) {
  return () => val++;
}

export function define<T>(constructor: Constructor<T>, builder: Builder<T>) {
  const build = factoryDefine(constructor, builder);

  async function create(attrs: Partial<T> = {}) {
    const conn = await connect();
    const instance = build(attrs);
    await conn.entityManager.persist(instance);
    return instance;
  }

  return { build, create };
}
