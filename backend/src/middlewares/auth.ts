import { Request, Response, NextFunction } from "express";
import serverConf from "../configs/serverConf";
import jwt, { JwtPayload } from "jsonwebtoken";

interface expectedDecoded {
  UserMetadata: {
    _id: string;
    username: string;
    role: string;
  };
}

async function verifyJWT(
  req: Request & expectedDecoded,
  res: Response,
  next: NextFunction
) {
  let accessToken = req.headers.authorization || req.headers.Authorization;

  if (!accessToken)
    return res.status(401).json({
      status: {
        success: false,
        message: "Unauthorized",
      },
    });

  let jwtMetadata: (string | JwtPayload | undefined) & expectedDecoded;
  if (typeof accessToken == "string") {
    accessToken = accessToken.split(" ")[1];
    jwt.verify(accessToken, serverConf.token, (err, decoded) => {
      if (err) return res.sendStatus(403); //Invalid token

      req.UserMetadata._id = (decoded as expectedDecoded).UserMetadata._id;
      req.UserMetadata.username = (
        decoded as expectedDecoded
      ).UserMetadata.username;
      req.UserMetadata.role = (decoded as expectedDecoded).UserMetadata.role;

      next();
    });
  }
}

export default verifyJWT;
