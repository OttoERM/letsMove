import { ConnectOptions } from "mongoose";

const dbOptions: ConnectOptions = {
  dbName: process.env.DB_DATABASE,
  authSource: process.env.DB_AUTHSOURCE || "admin",
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  connectTimeoutMS: 4000,
  family: 4,
  monitorCommands: true,
};

export default dbOptions;
