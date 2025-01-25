const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8000 });
const clients = new Map(); // storing new connected clients

server.on("connection", (socket) => {
  console.log("Client connected");

  let username = null;

  socket.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "setUsername") {
      // eslint-disable-next-line prefer-destructuring
      username = data.username;
      clients.set(socket, username);
      console.log(`${username} joined the chat`);
      return;
    }

    if (!username) return; // don't allow users to send message if they don't set username

    clients.forEach((user, client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ type: "message", username, text: data.text })
        );
      }
    });
  });

  socket.on("close", () => {
    console.log(`${username} disconnected`);
    clients.delete(socket); // Remove client when they disconnected
  });
});

console.log("Websocket server running on ws://localhost:8000");
