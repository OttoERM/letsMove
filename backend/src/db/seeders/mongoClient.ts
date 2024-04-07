//APPLIED WITH MONGODB driver not mongoose
/*Conection to db made with mongoClient because allow us to work with less abstraction*/

import { MongoClient, Db } from "mongodb";
import dbOptions from "../../configs/databaseConf";

export async function connectToDb(url: string): Promise<MongoClient> {
  const stringConn = url || "mongodb://localhost:27017/";

  const client = new MongoClient(stringConn, {
    // database: process.env.DB_DATABASE,
    authSource: process.env.DB_AUTHSOURCE || "admin",
    auth: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    connectTimeoutMS: 4000,
    family: 4,
    monitorCommands: true,
  });
  if (dbOptions.monitorCommands)
    client.on("commandStarted", (started) => console.log(started));

  await client.connect();
  console.log("Connected to database succesfully");

  return client;
}
