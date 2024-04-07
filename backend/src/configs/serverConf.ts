import jwt from "jsonwebtoken";

let portValue: number | undefined;

portValue = Number(process.env.SERVER_PORT);
if (isNaN(portValue)) portValue = undefined;

let tokenSecret: string;
if (!process.env.ACCESS_TOKEN_SECRET)
  throw new Error("No access token secret for jwt specified");
tokenSecret = process.env.ACCESS_TOKEN_SECRET;

export default {
  port: portValue || 3000,
  host: process.env.SERVER_HOST || "127.0.0.1",
  token: tokenSecret,
};
