"use client";

import { useState } from "react";
import sendMessage from "./api/messages_send";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  reservationId: number;
  onMessageSent: (newMessage: {
    message_id: number;
    sender_type: "cast";
    content: string;
    sent_at: string;
  }) => void;
}

export default function MessageInput({ reservationId, onMessageSent }: Props) {
  const [newMessage, setNewMessage] = useState("");
  const [rows, setRows] = useState(1);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const response = await sendMessage(reservationId, newMessage);
    if (response) {
      onMessageSent({
        message_id: response.message_id,
        sender_type: "cast",
        content: newMessage,
        sent_at: new Date().toISOString(),
      });

      setNewMessage("");
      setRows(1);
    }
  };

  return (
    <div className="border-t pt-3 flex items-center gap-2 px-3 bg-white shadow-md pb-3">
      <textarea
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none transition-all"
        placeholder="メッセージを入力..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        rows={rows}
        onFocus={() => setRows(3)}
        onBlur={() => !newMessage && setRows(1)}
      />
      <SendIcon
        fontSize="large"
        className="text-pink-500 cursor-pointer hover:text-pink-700 transition-all"
        onClick={handleSendMessage}
      />
    </div>
  );
}
