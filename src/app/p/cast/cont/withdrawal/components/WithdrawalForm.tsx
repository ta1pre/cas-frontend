"use client";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, Card, CardContent } from "@mui/material";
import { createWithdrawal, WithdrawalPayload, getPointBalance, PointBalance } from "../api/withdrawal";

interface Props {
  onSuccess: () => void;
}

export default function WithdrawalForm({ onSuccess }: Props) {
  const [regularAmount, setRegularAmount] = useState<string>("");
  const [bonusAmount, setBonusAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pointBalance, setPointBalance] = useState<PointBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await getPointBalance();
        setPointBalance(balance);
      } catch (err) {
        console.error('ポイント残高の取得に失敗しました:', err);
      } finally {
        setBalanceLoading(false);
      }
    };
    fetchBalance();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    
    const regAmount = Number(regularAmount) || 0;
    const bonAmount = Number(bonusAmount) || 0;
    
    // バリデーション
    if (regAmount === 0 && bonAmount === 0) {
      setError("少なくとも一つのポイント種別で金額を入力してください");
      return;
    }
    
    if (regAmount > 0 && regAmount < 10000) {
      setError("通常ポイントは最低10,000ポイントから申請できます");
      return;
    }
    
    if (bonAmount > 0 && bonAmount < 10000) {
      setError("ボーナスポイントは最低10,000ポイントから申請できます");
      return;
    }
    
    if (pointBalance) {
      if (regAmount > pointBalance.regular_points) {
        setError("通常ポイントの残高が不足しています");
        return;
      }
      if (bonAmount > pointBalance.bonus_points) {
        setError("ボーナスポイントの残高が不足しています");
        return;
      }
    }
    
    setLoading(true);
    const payload: WithdrawalPayload = { 
      regular_amount: regAmount, 
      bonus_amount: bonAmount 
    };
    const res = await createWithdrawal(payload);
    setLoading(false);
    if (res && !res.detail) {
      setSuccess("申請を受け付けました");
      setRegularAmount("");
      setBonusAmount("");
      onSuccess();
    } else {
      setError(res?.detail || "申請に失敗しました");
    }
  };

  return (
    <Box className="space-y-4" sx={{ maxWidth: 400 }}>
      {/* ポイント残高表示 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" className="text-pink-600 font-bold" sx={{ mb: 2 }}>
            現在のポイント残高
          </Typography>
          {balanceLoading ? (
            <CircularProgress size={24} />
          ) : pointBalance ? (
            <Box className="space-y-2">
              <Box display="flex" justifyContent="space-between">
                <Typography>通常ポイント:</Typography>
                <Typography fontWeight="bold">
                  {pointBalance.regular_points.toLocaleString()}pt
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>ボーナスポイント:</Typography>
                <Typography fontWeight="bold">
                  {pointBalance.bonus_points.toLocaleString()}pt
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" sx={{ borderTop: 1, pt: 1 }}>
                <Typography fontWeight="bold">合計:</Typography>
                <Typography fontWeight="bold" color="primary">
                  {pointBalance.total_points.toLocaleString()}pt
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography color="error">残高の取得に失敗しました</Typography>
          )}
        </CardContent>
      </Card>

      {/* 出金申請フォーム */}
      <Box className="space-y-4 p-4 bg-white shadow rounded">
        <Typography variant="h6" className="text-pink-600 font-bold">
          出金申請
        </Typography>
      <TextField
        label="通常ポイント出金額"
        value={regularAmount}
        fullWidth
        onChange={(e) => setRegularAmount(e.target.value)}
        type="number"
        inputProps={{ min: 0, step: 1000 }}
        helperText="最低10,000ポイント（0の場合は申請しない）"
        sx={{ mb: 2 }}
      />
      <TextField
        label="ボーナスポイント出金額"
        value={bonusAmount}
        fullWidth
        onChange={(e) => setBonusAmount(e.target.value)}
        type="number"
        inputProps={{ min: 0, step: 1000 }}
        helperText="最低10,000ポイント（0の場合は申請しない）"
        sx={{ mb: 2 }}
      />
      {regularAmount && bonusAmount && (
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            申請合計: {(Number(regularAmount) + Number(bonusAmount)).toLocaleString()}pt
          </Typography>
        </Box>
      )}
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
    </Box>
  );
}
