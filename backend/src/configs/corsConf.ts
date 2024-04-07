import { CorsOptions } from "cors";

var whitelist = ["http://localhost:3000", "http://localhost:4200"];
const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    console.log(`Request from ${requestOrigin}, corsConf.ts`);

    if (!requestOrigin || whitelist.indexOf(requestOrigin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

export { corsOptions, whitelist };
