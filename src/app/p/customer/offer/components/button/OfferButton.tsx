// src/app/p/customer/offer/components/button/OfferButton.tsx
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import EastIcon from "@mui/icons-material/East";

interface OfferButtonProps {
  castId: number;
  type?: "first" | "repeat";
}

const OfferButton: React.FC<OfferButtonProps> = ({ castId, type = "first" }) => {
  const router = useRouter();

  const handleClick = () => {
    const targetPath = type === "repeat" 
      ? `/p/customer/offer/repeat/${castId}` // ✅ 再指名用
      : `/p/customer/offer/first/${castId}`; // ✅ 初回オファー用
    router.push(targetPath);
  };

  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: "#ec4899",
        "&:hover": { backgroundColor: "#db2777" },
        borderRadius: "9999px",
        padding: "12px 24px",
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "none",
        marginTop: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
      onClick={handleClick}
    >
      <span style={{ flex: 1, textAlign: "center" }}>
        {type === "repeat" ? "再指名する" : "今すぐ簡単リクエスト"}
      </span>
      <EastIcon />
    </Button>
  );
};

export default OfferButton;
