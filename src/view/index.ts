import { Context } from "koa";
import * as fs from "fs";

const readFile = Promise.promisify(fs.readFile);

export async function index(ctx: Context) {
  if (!ctx.state.user) {
    return ctx.redirect("/auth");
  }

  ctx.type = "text/html";
  ctx.body = await readFile(__dirname + "/index.html");
}
