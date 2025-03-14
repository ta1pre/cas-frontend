"use client";

import { useState, useRef } from "react";
import sendMessage from "./api/messages_send";
import SendIcon from "@mui/icons-material/Send"; // ✅ 送信アイコン

interface Props {
  reservationId: number;
  onMessageSent: (newMessage: {
    message_id: number;
    sender_type: "user";
    content: string;
    sent_at: string;
  }) => void;
}

export default function MessageInput({ reservationId, onMessageSent }: Props) {
  const [newMessage, setNewMessage] = useState("");
  const [rows, setRows] = useState(1); // ✅ 初期は1行

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const response = await sendMessage(reservationId, newMessage);
    if (response) {
      onMessageSent({
        message_id: response.message_id,
        sender_type: "user",
        content: newMessage,
        sent_at: new Date().toISOString(),
      });

      setNewMessage(""); // ✅ 入力欄をクリア
      setRows(1); // ✅ 送信後に1行に戻す
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // ✅ Enter単体で送信
      handleSendMessage();
    }
  };

  return (
    <div className="border-t pt-3 flex items-center gap-2 px-3 bg-white shadow-md pb-3">
      {/* ✅ 普段は1行、フォーカス時に3行に拡張 */}
      <textarea
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none transition-all"
        placeholder="メッセージを入力..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown} // ✅ Enterで送信, Shift+Enterで改行
        rows={rows}
        onFocus={() => setRows(3)} // ✅ フォーカス時に拡張
        onBlur={() => !newMessage && setRows(1)} // ✅ 空なら1行に戻す
      />
      <SendIcon
        fontSize="large"
        className="text-gray-500 cursor-pointer hover:text-gray-700 transition-all" // ✅ アイコンだけクリック可能
        onClick={handleSendMessage}
      />
    </div>
  );
}
