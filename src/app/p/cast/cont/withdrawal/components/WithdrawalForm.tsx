"use client";
import { useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { createWithdrawal, WithdrawalPayload } from "../api/withdrawal";

interface Props {
  onSuccess: () => void;
}

export default function WithdrawalForm({ onSuccess }: Props) {
  const [amount, setAmount] = useState<string>("");
  const [pointSource, setPointSource] = useState<"regular" | "bonus">("regular");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!amount || isNaN(Number(amount)) || Number(amount) < 10000) {
      setError("金額を正しく入力してください");
      return;
    }
    setLoading(true);
    const payload: WithdrawalPayload = { amount: Number(amount), point_source: pointSource };
    const res = await createWithdrawal(payload);
    setLoading(false);
    if (res && !res.detail) {
      setSuccess("申請を受け付けました");
      setAmount("");
      onSuccess();
    } else {
      setError(res?.detail || "申請に失敗しました");
    }
  };

  return (
    <Box className="space-y-4 p-4 bg-white shadow rounded" sx={{ maxWidth: 400 }}>
      <Typography variant="h6" className="text-pink-600 font-bold">
        出金申請
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="ps-label">ポイント種別</InputLabel>
        <Select
          labelId="ps-label"
          value={pointSource}
          label="ポイント種別"
          onChange={(e) => setPointSource(e.target.value as "regular" | "bonus")}
        >
          <MenuItem value="regular">通常ポイント</MenuItem>
          <MenuItem value="bonus">ボーナスポイント</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="金額 (ポイント)"
        value={amount}
        fullWidth
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        inputProps={{ min: 10000, step: 1000 }}
        helperText="最低10,000ポイント"
      />
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
        sx={{ bgcolor: "#ec407a", "&:hover": { bgcolor: "#d81b60" } }}
      >
        {loading ? <CircularProgress size={24} /> : "申請する"}
      </Button>
    </Box>
  );
}
