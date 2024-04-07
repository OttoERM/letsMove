import { connection } from "websocket";

interface customConnection {
  userId: string;
  connection: connection;
}

export default customConnection;
