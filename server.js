const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/add", (req, res) => {
  const { num1, num2 } = req.body;

  res.json({ answer: num1 + num2 });
});

app.post("/subtract", (req, res) => {
  const { num1, num2 } = req.body;

  res.json({ answer: num1 - num2 });
});

app.post("/multiply", (req, res) => {
  const { num1, num2 } = req.body;

  res.json({ answer: num1 * num2 });
});

app.post("/divide", (req, res) => {
  const { num1, num2 } = req.body;

  res.json({ answer: num1 / num2 });
});

const server = http.createServer(app);

const webSocketClient = new WebSocket.Server({ server });

webSocketClient.on("connection", (websocket) => {
  console.log("WebSocket connected");
});

webSocketClient.on("close", () => {
  console.log("Websocket disconnected");
});

server.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
