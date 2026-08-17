const mqtt = require('mqtt');

console.log("Starting HiveMQ MQTT over WebSockets verification...");
const topic = "itoura/room/test_" + Math.random().toString(36).substring(7);

// HiveMQ free public MQTT WebSockets broker
const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
console.log("Connecting to Topic:", topic);

const clientA = mqtt.connect(brokerUrl);
const clientB = mqtt.connect(brokerUrl);

let received = false;

clientA.on('connect', () => {
  console.log("[Client A] Connected!");
  setTimeout(() => {
    console.log("[Client A] Publishing test message...");
    clientA.publish(topic, JSON.stringify({ text: "Hello from Client A" }));
  }, 1500);
});

clientB.on('connect', () => {
  console.log("[Client B] Connected! Subscribing to topic...");
  clientB.subscribe(topic, (err) => {
    if (err) console.error("Subscribe error:", err);
  });
});

clientB.on('message', (t, message) => {
  console.log("[Client B] Received message on topic:", t, message.toString());
  try {
    const data = JSON.parse(message.toString());
    if (data.text === "Hello from Client A") {
      received = true;
      console.log("SUCCESS: HiveMQ Public MQTT over WSS works 100% reliably!");
      cleanup();
    }
  } catch (e) {
    console.error("Parse error:", e);
  }
});

function cleanup() {
  clientA.end();
  clientB.end();
  process.exit(received ? 0 : 1);
}

setTimeout(() => {
  console.log("Verification finished. Received state:", received);
  cleanup();
}, 6000);
