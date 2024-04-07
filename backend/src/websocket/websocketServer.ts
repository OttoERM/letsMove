import { createServer } from "http";
import { Message, request, server } from "websocket";
import customConnection from "./connection";
import message from "./message";

const connectionPool: customConnection[] = [];

const httpServer = createServer((req, res) => {
  console.log("Request received");
});

const websocket = new server({
  httpServer: httpServer,
});

httpServer.listen(8080, () => {
  console.log("Websocket server listening in http://localhost:8080");
});

websocket.on("request", (req: request) => {
  const userId = req.resourceURL.query.userid;
  console.log("request reached", userId);

  if (!userId || Array.isArray(userId)) return req.reject();

  const connection = req.accept(null, req.origin);

  connectionPool.push({
    userId: userId as string,
    connection: connection,
  });

  connection.on("message", (message: Message) => {
    if (message.type !== "utf8") return;

    const dataMessage: message = JSON.parse(message.utf8Data);
    console.log(dataMessage);

    connectionPool.forEach((conn) => {
      if (conn.userId == dataMessage.toId) {
        conn.connection.send(JSON.stringify(dataMessage));
      }
    });
  });
});
