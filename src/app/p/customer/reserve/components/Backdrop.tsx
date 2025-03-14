import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isVisible: boolean;
  onClick: () => void;
  onCloseAll: () => void;
}

export default function Backdrop({ isVisible, onClick, onCloseAll }: Props) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // ✅ フェードアウト効果修正
          transition={{ duration: 0.9 }} // ✅ スムーズなフェード
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }} // ✅ 透明度調整
          onClick={(e) => {
            if (e.clientX < window.innerWidth * 0.3) {
              onCloseAll(); // ✅ 画面左30%タップで全体閉じる
            } else {
              onClick(); // ✅ それ以外をタップでメッセージのみ閉じる
            }
          }}
        />
      )}
    </AnimatePresence>
  );
}
