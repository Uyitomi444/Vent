console.log("Starting PieSocket relay verification on Node v22...");
const channelId = "channel_itoura_test_" + Math.random().toString(36).substring(7);
const apiKey = "oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm";

const wsUrl = `wss://demo.piesocket.com/v3/${channelId}?api_key=${apiKey}&notify_self=0`;
console.log("Connecting to WSS URL:", wsUrl);

const clientA = new WebSocket(wsUrl);
const clientB = new WebSocket(wsUrl);

let received = false;

clientA.onopen = () => {
  console.log("[Client A] Connected!");
  setTimeout(() => {
    console.log("[Client A] Sending test message...");
    clientA.send(JSON.stringify({ text: "Hello from Client A", senderUserId: "A" }));
  }, 1500);
};

clientB.onopen = () => {
  console.log("[Client B] Connected!");
};

clientB.onmessage = (event) => {
  console.log("[Client B] Received message:", event.data);
  try {
    const data = JSON.parse(event.data);
    if (data.text === "Hello from Client A") {
      received = true;
      console.log("SUCCESS: PieSocket real-time Pub/Sub WSS relay works 100%!");
      cleanup();
    }
  } catch (e) {
    console.error("Parse error:", e);
  }
};

function cleanup() {
  clientA.close();
  clientB.close();
  process.exit(received ? 0 : 1);
}

setTimeout(() => {
  console.log("Verification finished. Received state:", received);
  cleanup();
}, 5000);
