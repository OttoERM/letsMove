import mongoose, { ConnectOptions } from "mongoose";

export async function createConnection(
  url: string,
  connOptions: ConnectOptions
): Promise<mongoose.Connection> {
  const mongooseInstance = await mongoose
    .createConnection(url, connOptions)
    .asPromise();

  if (mongooseInstance.readyState == 1)
    console.log("Connection to database established");
  else {
    throw new Error("Couldn't connect to database");
  }

  return mongooseInstance;
}
