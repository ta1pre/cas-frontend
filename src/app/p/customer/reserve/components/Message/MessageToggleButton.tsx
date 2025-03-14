import ChatIcon from "@mui/icons-material/Chat";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Props {
  isOpen: boolean; // ✅ 開閉状態
  onClick: () => void; // ✅ クリック時の動作
}

export default function MessageToggleButton({ isOpen, onClick }: Props) {
  return (
    <div
      className="flex justify-between items-center bg-gray-100 p-3 border-b cursor-pointer"
      onClick={onClick} // ✅ クリックで開閉
    >
      <div className="flex items-center gap-2">
        <ChatIcon className="text-gray-700" fontSize="medium" /> {/* ✅ メッセージアイコン */}
        <h2 className="text-lg font-semibold text-gray-800">メッセージ</h2>
      </div>
      {isOpen ? (
        <KeyboardArrowDownIcon className="text-gray-500" fontSize="large" /> // ✅ ↓ アイコン
      ) : (
        <KeyboardArrowUpIcon className="text-gray-500" fontSize="large" /> // ✅ ↑ アイコン
      )}
    </div>
  );
}
