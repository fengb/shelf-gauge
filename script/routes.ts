#!/usr/bin/env ts-node

import "../config/boot";

import { chain, padEnd, zip, zipWith } from "lodash";

import router from "src/router";

function methodOf(layer: any) {
  if (layer.methods.includes("ACL")) {
    // TODO: actually detect redirects
    return "REDIRECT";
  } else {
    return layer.methods.find((m: string) => m != "HEAD");
  }
}

function transpose<T>(matrix: T[][]) {
  return zip(...matrix);
}

function printTable(table: string[][]) {
  const widths = transpose(table).map(cols => {
    return Math.max(...cols.map(c => c.length));
  });

  for (const row of table) {
    const line = zipWith(row, widths, padEnd);
    console.log(line.join(" "));
  }
}

chain(router.stack)
  .filter(layer => layer.methods.length > 0)
  .map(layer => [methodOf(layer), layer.path])
  .tap(printTable)
  .value();
