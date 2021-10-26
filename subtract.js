const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "subtract",
  brokers: ["localhost:9092"],
});

async function main() {
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: "consumer-subtract" });

  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "subtract", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { num1, num2 } = JSON.parse(message.value.toString());

      producer.send({
        topic: "difference",
        messages: [{ value: JSON.stringify(num1 - num2) }],
      });
    },
  });
}

try {
  main();

  console.log("Subtraction microservice is running");
} catch (error) {
  console.error(error.message);
}
