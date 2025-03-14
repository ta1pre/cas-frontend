import { motion } from "framer-motion";
import MessageToggleButton from "./MessageToggleButton"; // ✅ インポート
import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface Message {
  message_id: number;
  sender_type: "user" | "cast" | "admin";
  content: string;
  sent_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservationId: number;
}

export default function MessagePanel({ isOpen, onClose, reservationId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isOpen ? "0%" : "100%" }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 100 }}
      onDragEnd={(e, info) => {
        if (info.offset.y > 50) {
          onClose();
        }
      }}
      className="fixed bottom-0 right-0 w-9/10 h-4/5 bg-white shadow-lg z-50 flex flex-col"
    >
      {/* ✅ ヘッダー部分（クリックで閉じる） */}
      <div onClick={(e) => { 
        e.stopPropagation(); // ✅ クリックイベントのバブリングを防ぐ
        onClose(); // ✅ メッセージパネルを閉じる
      }}>
        <MessageToggleButton isOpen={true} onClick={() => {}} />
      </div>

      <MessageList reservationId={reservationId} messages={messages} setMessages={setMessages} />
      <MessageInput reservationId={reservationId} onMessageSent={handleNewMessage} />
    </motion.div>
  );
}
