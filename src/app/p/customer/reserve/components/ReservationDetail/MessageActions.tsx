interface Props {
  onOpenMessage: () => void; // ✅ 正しく型を定義
}

export default function MessageActions({ onOpenMessage }: Props) {
  return (
    <div className="mt-4">
      <button 
        onClick={(e) => { e.stopPropagation(); onOpenMessage(); }} 
        className="mt-4 p-2 bg-green-500 text-white rounded w-full"
      >
        メッセージを開くよ
      </button>
    </div>
  );
}
