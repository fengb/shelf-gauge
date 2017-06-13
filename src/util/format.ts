import { chain, round } from "lodash";

export function percent(number: number, { suffix = true } = {}) {
  return [
    number >= 0 ? "+" : "",
    (100 * number).toFixed(2),
    suffix ? "%" : ""
  ].join("");
}

export function markdownTable(...cells: string[][]): string {
  return chain(cells)
    .map(row => "| " + row.join(" | ") + " |")
    .join("\n")
    .value();
}
