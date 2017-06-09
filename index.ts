import "./config/boot";

import ENV from "./config/env";
import server from "./src/server";

server.listen(ENV.server.port, () => {
  console.log(`Started on port ${ENV.server.port}`);
});
