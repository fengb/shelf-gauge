import { round } from "lodash";

export function percent(number: number, { suffix = true, sign = false } = {}) {
  return [
    sign && number >= 0 ? "+" : "",
    (100 * number).toFixed(2),
    suffix ? "%" : ""
  ].join("");
}
