const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { setChatRoomId } from "../features/chatSlice";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const MessageSection = () => {
  const dispatch = useDispatch();
  const friendId = useSelector((state) => state.chat.friendId);
  const chatRoomId = useSelector((state) => state.chat.chatRoomId);
  const userId = useSelector((state) => state.auth.user?.id);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    const fetchChatRoomId = async () => {
      if (!friendId) return;

      try {
        const response = await fetch(`${BASE_URL}/chat/getChatRoom/${friendId}?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch chat room ID");
        }
        const data = await response.json();
        console.log("Data", data.chatRoomId);
        dispatch(setChatRoomId(data.chatRoomId));
        console.log("Updated chatRoomId:", data.chatRoomId);
      } catch (error) {
        console.error("Error fetching chat room ID:", error);
      }
    };

    fetchChatRoomId();
  }, [friendId]);

  useEffect(() => {
    if (!chatRoomId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/chat/messages/${chatRoomId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [chatRoomId]);

  useEffect(() => {
    if (!stompClient) {
      const socket = new SockJS(`${BASE_URL}/ws`);
      const client = over(socket);
      client.connect({}, () => {
        console.log("WebSocket Connected!");
        setStompClient(client);

        client.subscribe("/topic/messages", (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("Message received:", receivedMessage);

          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      });
    }
  }, [stompClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!stompClient || !friendId || !userId) {
      console.error("Cannot send message. Required fields are missing.");
      return;
    }

    console.log("Sending message to WebSocket:", { friendId, chatRoomId });

    const chatMessage = {
      chatRoomId: chatRoomId,
      senderId: userId,
      receiverId: friendId,
      content: message
    };

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (chatRoomId) {
      setIsChatOpen(true);
    }
  }, [chatRoomId]);

  const closeChat = () => {
    setIsChatOpen(false);
  };

  if (!isChatOpen) return null;

  return (
    <div
      className="
    fixed bottom-6 right-6 w-[95vw] sm:w-[320px]
    bg-background border border-border shadow-lg rounded-xl
    z-50
  "
    >
      <div className="felx">
        <h2 className="text-foreground font-semibold px-3 pt-2">Chat with: {friendId || "No friend selected"}</h2>

        <button
          className="
    absolute top-0 right-1 text-xl font-bold text-destructive hover:text-destructive/80
    transition
  "
          onClick={closeChat}
        >
          ✖
        </button>
      </div>

      <div className="chat-messages bg-card text-foreground">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === userId ? "sent" : "received"}`}>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="input-container">
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="emoji-button">
          😊
        </button>

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-12 right-0 z-50">
            <Picker data={data} onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji.native)} />
          </div>
        )}
        <input
          type="text"
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />

        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageSection;
