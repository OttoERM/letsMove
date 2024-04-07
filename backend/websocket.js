const http = require("http");
const WebSocketServer = require("websocket").server;
let connectionPool = [];
let connection = null;

//create a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)
const httpserver = http.createServer((req, res) =>
  console.log("we have received a request")
);

//pass the httpserver object to the WebSocketServer library to do all the job, this class will override the req/res
const websocket = new WebSocketServer({
  httpServer: httpserver,
});

httpserver.listen(8080, () =>
  console.log("My server is listening on port 8080")
);

//when a legit websocket request comes listen to it and get the connection .. once you get a connection thats it!
websocket.on("request", (request) => {
  connection = request.accept(null, request.origin);
  connection.myCustomId = connectionPool.length;
  connectionPool.push(connection);
  //   console.log("Connection pool:", connectionPool);

  //open will never get called but I'm leaving this as a lesson for myself
  //the reason is the connection has already been opened before we set the listener
  //connection.on("open", () => console.log("Opened!!!"));

  connection.on("close", () => {
    connection.close();
    console.log("CLOSED!!!");
  });

  connection.on("message", (message) => {
    console.log(`Received message ${message.utf8Data}`);
    connectionPool.forEach((conn) => {
      console.log("Conn id:", conn.myCustomId);
      if (connection.myCustomId != conn.myCustomId) conn.send(message.utf8Data);
    });
  });

  //use connection.send to send stuff to the client
  //   sendevery5seconds();
});

function sendevery5seconds() {
  connection.send(`Message ${Math.random()}`);

  setTimeout(sendevery5seconds, 5000);
}

//client code
//let ws = new WebSocket("ws://localhost:8080");
//ws.onmessage = message => console.log(`Received: ${message.data}`);
//ws.send("Hello! I'm client")
