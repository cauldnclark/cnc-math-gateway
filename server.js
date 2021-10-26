const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "gateway",
  brokers: ["localhost:9092"],
});

async function main() {
  const app = express();
  const PORT = 8080;
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: "consumer-gateway" });

  await producer.connect();
  await consumer.connect();

  app.use(express.json());

  app.get("/", (_, res) => {
    res.json({ status: "ok" });
  });

  app.post("/add", (req, res) => {
    const { num1, num2 } = req.body;

    producer.send({
      topic: "add",
      messages: [{ value: JSON.stringify({ num1, num2 }) }],
    });

    res.json({ message: "We are processing your request" });
  });

  app.post("/subtract", (req, res) => {
    const { num1, num2 } = req.body;

    producer.send({
      topic: "subtract",
      messages: [{ value: JSON.stringify({ num1, num2 }) }],
    });

    res.json({ message: "We are processing your request" });
  });

  app.post("/multiply", (req, res) => {
    const { num1, num2 } = req.body;

    producer.send({
      topic: "multiply",
      messages: [{ value: JSON.stringify({ num1, num2 }) }],
    });

    res.json({ message: "We are processing your request" });
  });

  app.post("/divide", (req, res) => {
    const { num1, num2 } = req.body;

    producer.send({
      topic: "divide",
      messages: [{ value: JSON.stringify({ num1, num2 }) }],
    });

    res.json({ message: "We are processing your request" });
  });

  const server = http.createServer(app);

  const webSocketClient = new WebSocket.Server({ server });

  consumer.subscribe({ topic: "sum", fromBeginning: true });
  consumer.subscribe({ topic: "product", fromBeginning: true });
  consumer.subscribe({ topic: "quotient", fromBeginning: true });
  consumer.subscribe({ topic: "difference", fromBeginning: true });

  webSocketClient.on("connection", (websocket) => {
    console.log("WebSocket connected");

    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();

        websocket.send(JSON.stringify({ [topic]: value }));
      },
    });
  });

  webSocketClient.on("close", () => {
    console.log("Websocket disconnected");
  });

  server.listen(PORT, () =>
    console.log(`Server is running at http://localhost:${PORT}`)
  );
}

try {
  main();
} catch (error) {
  console.error(error.message);
}
