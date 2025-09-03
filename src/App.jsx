import { useEffect, useState, useRef } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [targetId, setTargetId] = useState("esp32-1");
  const socketRef = useRef(null);

  const myId = "react-1"; // ID de este React

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "register", id: myId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, `${data.from}: ${data.msg}`]);
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (socketRef.current && input.trim()) {
      socketRef.current.send(
        JSON.stringify({
          type: "message",
          from: myId,
          to: targetId,
          msg: input,
        })
      );
      setInput("");
    }
  };

  return (
    <div>
      <h1>React WebSocket con IDs</h1>
      <div>
        <label>ESP32 destino: </label>
        <input
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          placeholder="ej: esp32-2"
        />
      </div>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default App;
