const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "add",
  brokers: ["localhost:9092"],
});

async function main() {
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: "consumer-add" });

  await producer.connect();
  await consumer.connect();
}

try {
  main();

  console.log("Addition microservice is running");
} catch (error) {
  console.error(error.message);
}
