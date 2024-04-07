require("./loaders/loadENV");
import express, { Express } from "express";
import expressLoader from "./loaders/expressLoader";
import initRepositories from "./loaders/initRepositories";
import serverConf from "./configs/serverConf";
import dbOptions from "./configs/databaseConf";
import { createConnection } from "./db/dbConn";

require("./websocket/websocketServer");

async function startApp() {
  const letsMove = await createConnection(
    "mongodb://localhost:27017/",
    dbOptions
  );
  initRepositories(letsMove);

  const app: Express = express();
  expressLoader(app);

  app.listen(serverConf.port, serverConf.host, () => {
    console.log(`Server is running at http://localhost:${serverConf.port}`);
  });
}
startApp();
