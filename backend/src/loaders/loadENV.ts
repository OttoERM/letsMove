import dotenv from "dotenv";

const envFound = dotenv.config();
if (!envFound) throw new Error("ENV file not found");

import databaseConf from "../configs/databaseConf";
import serverConf from "../configs/serverConf";
import { whitelist } from "../configs/corsConf";

if (!databaseConf.dbName) throw new Error("Database is not defined");

if (!serverConf.port) throw new Error("Server port is not defined");

if (whitelist.length == 0) throw new Error("Origin whitelist is empty");
