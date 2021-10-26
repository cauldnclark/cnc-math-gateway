const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "multiply",
  brokers: ["localhost:9092"],
});

async function main() {
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: "consumer-multiply" });

  await producer.connect();
  await consumer.connect();
}

try {
  main();

  console.log("Multiplication microservice is running");
} catch (error) {
  console.error(error.message);
}
