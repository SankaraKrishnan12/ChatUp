import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Chat from "./Chat.jsx";

const socket = io.connect("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username.trim() !== "" && room.trim() !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    } else {
      alert("Please enter both username and room ID.");
    }
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID..."
            value={room}
            onChange={(event) => setRoom(event.target.value)}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;