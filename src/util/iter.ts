import { some } from "lodash";

export function needsAssign(target: any, source: object): boolean {
  return some(source, (value, key: string) => target[key] !== value);
}
