import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { auth, db, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import "./App.css";

const socket = io("http://localhost:5000"); // Replace with your backend URL in production

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      // Fetch messages from Firestore
      const q = query(collection(db, "messages"), orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up on unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && user) {
      const data = {
        username: user.displayName || user.email,
        message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", data);
      setMessage("");
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Chat App</h1>
      {user ? (
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg) => (
              <div key={msg.id} className="message">
                <strong>{msg.username}: </strong>
                {msg.message} <em>({new Date(msg.timestamp?.toDate()).toLocaleTimeString()})</em>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <button onClick={() => auth.signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
}

export default App;