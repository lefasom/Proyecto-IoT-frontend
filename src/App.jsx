import { useEffect, useState, useRef } from "react";
import img1 from "./assets/detectar.png";
import img2 from "./assets/guardar.png";

function App() {
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(""); // <-- nuevo estado para el último msg
  const [input, setInput] = useState("");
  const [targetId, setTargetId] = useState("esp32_1");
  const [status, setStatus] = useState("Desconectado");
  const socketRef = useRef(null);

  const myId = "react-1"; // ID de este React

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("Conectado");
      socket.send(JSON.stringify({ type: "register", id: myId }));
    };

    socket.onclose = () => setStatus("Desconectado");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const timestamp = new Date().toLocaleTimeString();
      const formattedMsg = `[${timestamp}] ${data.from} → ${myId} : ${data.msg}`;

      // Guardamos en el historial completo
      setMessages((prev) => [...prev, formattedMsg]);

      // Guardamos solamente el último mensaje (solo el contenido `msg`)
      setLastMessage(data.msg);
    };

    return () => socket.close();
  }, []);

  const sendMessage = (msg) => {
    if (socketRef.current && msg.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      const formattedMsg = `[${timestamp}] ${myId} → ${targetId} : ${msg}`;

      // Guardar también en el display los mensajes enviados
      setMessages((prev) => [...prev, formattedMsg]);

      socketRef.current.send(
        JSON.stringify({
          type: "message",
          from: myId,
          to: targetId,
          msg,
        })
      );

      // actualizamos también el último mensaje (cuando yo envío)
      setLastMessage(msg);

      setInput(""); // limpiar input solo si fue desde el campo
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1>React WebSocket con IDs</h1>

      {/* Estado y mensajes (display con historial) */}
      <div
        style={{
          backgroundColor: "#111",
          fontFamily: "monospace",
          width: "360px",
          height: "180px",
          border: "1px solid #0f0",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <p style={{ fontSize: "16px", color: "rgba(20, 175, 226, 1)" }}>
          Estado: <strong>{status}</strong>
        </p>
        <div style={{ fontSize: "15px", color: "#0f0", whiteSpace: "pre-wrap" }}>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      </div>

      {/* Segunda pantalla: solo último mensaje */}
      <div
        style={{
          backgroundColor: "#222",
          fontFamily: "monospace",
          width: "360px",
          height: "80px",
          border: "1px solid #f0f",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#f0f",
          fontSize: "18px",
        }}
      >
        {lastMessage || "Esperando mensaje..."}
      </div>

      {/* Selección de destino */}
      <div>
        <label>ESP32 destino: </label>
        <input
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          placeholder="ej: esp32-2"
        />
      </div>

      {/* Input manual */}
      <div style={{ marginTop: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          Enviar
        </button>
      </div>

      {/* Botones touch */}
      <div
        style={{
          display: "flex",
          gap: "80px",
          marginTop: "20px",
        }}
      >
        {/* Botón Agregar huella */}
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              sendMessage("agregar_huella");
            }}
            disabled={status !== "Conectado"}
            style={{
              width: "60px",
              height: "60px",
              padding: "0",
              borderRadius: "50%",
              border: "2px solid #0f0",
              backgroundColor: status === "Conectado" ? "#444" : "#999",
              cursor: status === "Conectado" ? "pointer" : "not-allowed",
              boxShadow: "0 4px #222, inset 0 0 10px rgba(0,0,0,0.5)",
              transition: "transform 0.1s ease",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={img2}
              alt="guardar huella"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </button>
          <p>Agregar huella</p>
        </div>

        {/* Botón Detectar huella */}
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              sendMessage("detectar_huella");
            }}
            disabled={status !== "Conectado"}
            style={{
              width: "60px",
              height: "60px",
              padding: "0",
              borderRadius: "50%",
              border: "2px solid #0f0",
              backgroundColor: status === "Conectado" ? "#444" : "#999",
              cursor: status === "Conectado" ? "pointer" : "not-allowed",
              boxShadow: "0 4px #222, inset 0 0 10px rgba(0,0,0,0.5)",
              transition: "transform 0.1s ease",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={img1}
              alt="detectar huella"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </button>
          <p>Detectar huella</p>
        </div>
      </div>
    </div>
  );
}

export default App;
