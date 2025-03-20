import { useEffect, useRef, useState } from "react";
import fetchMessages from "./api/messages_get";
import { fetchCustomerCast } from "../../api/getCastName";
import { motion } from "framer-motion";
import { Avatar } from "@mui/material";

interface Message {
  message_id: number;
  sender_id?: number;
  sender_type: "user" | "cast" | "admin";
  content: string;
  sent_at: string;
}

interface Props {
  reservationId: number;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function MessageList({ reservationId, messages, setMessages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [castImage, setCastImage] = useState<string>("/default-avatar.png");
  const [isUserScrolling, setIsUserScrolling] = useState(false); // ✅ スクロール中かどうかを判定

  useEffect(() => {
    async function loadCastInfo() {
      const castMsg = messages.find((m) => m.sender_type === "cast" && m.sender_id);
      if (!castMsg?.sender_id) return;
      const castData = await fetchCustomerCast(castMsg.sender_id);
      if (castData?.profile_image_url) {
        setCastImage(castData.profile_image_url);
      }
    }
    loadCastInfo();
  }, [reservationId, messages]);

  useEffect(() => {
    async function loadMessages() {
      const data = await fetchMessages(reservationId);
      if (data) {
        setMessages(
          data.messages.map((msg: any) => ({
            ...msg,
            sender_type: msg.sender_type ?? "user",
          }))
        );
      }
    }
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [reservationId]);

  // ✅ ユーザーがスクロールしているかを検出
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

      // ✅ スクロール位置が一番下から100px以上離れていたら "スクロール中"
      setIsUserScrolling(scrollHeight - (scrollTop + clientHeight) > 100);
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ 新しいメッセージが追加された時のスクロール処理
  useEffect(() => {
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-2 space-y-4">
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center">メッセージがありません。</p>
      ) : (
        messages.map((msg) => (
          <motion.div
            key={msg.message_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender_type !== "user" && (
              <Avatar
                src={msg.sender_type === "cast" ? castImage : "/admin-avatar.png"}
                alt="Sender"
                className="w-8 h-8 mr-2"
              />
            )}
            <div className="flex flex-col max-w-[75%]">
              <div className={`relative p-3 rounded-lg shadow-md text-sm ${msg.sender_type === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                <p>{msg.content}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 text-right">
                {new Date(msg.sent_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })} {new Date(msg.sent_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </motion.div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
