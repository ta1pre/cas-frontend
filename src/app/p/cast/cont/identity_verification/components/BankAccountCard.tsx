"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { getBankAccount, updateBankAccount } from "../services/identityService";

interface BankAccount {
  bank_name: string;
  branch_name: string;
  branch_code: string;
  account_type: string;
  account_number: string;
  account_holder: string;
}

interface Props {
  initialAccount?: BankAccount | null;
  onSaveSuccess: (account: BankAccount) => void;
}

const emptyAccount: BankAccount = {
  bank_name: "",
  branch_name: "",
  branch_code: "",
  account_type: "",
  account_number: "",
  account_holder: "",
};

export default function BankAccountCard({ initialAccount = null, onSaveSuccess }: Props) {
  const [account, setAccount] = useState<BankAccount>(initialAccount || emptyAccount);
  const [original, setOriginal] = useState<BankAccount | null>(initialAccount);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 初期口座情報が後から渡された場合に同期
  useEffect(() => {
    if (initialAccount) {
      setAccount(initialAccount);
      setOriginal(initialAccount);
      setLoading(false);
      return;
    }
    const fetch = async () => {
      try {
        const data = await getBankAccount();
        if (data) {
          setAccount(data);
          setOriginal(data);
        }
      } catch (e) {
        console.error("銀行口座取得エラー", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [initialAccount]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateBankAccount(account);
      setOriginal(account);
      setIsEdit(false);
      onSaveSuccess(account);
    } catch (e) {
      alert("口座情報の保存に失敗しました");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>読込中...</Typography>;

  if (!isEdit && original) {
    // 閲覧モード
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            登録済み口座情報
          </Typography>
          <Typography>銀行名: {original.bank_name}</Typography>
          <Typography>支店名: {original.branch_name}</Typography>
          <Typography>支店コード: {original.branch_code}</Typography>
          <Typography>口座種別: {original.account_type}</Typography>
          <Typography>口座番号: {original.account_number}</Typography>
          <Typography>口座名義: {original.account_holder}</Typography>
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={() => setIsEdit(true)}>
            編集する
          </Button>
        </CardActions>
      </Card>
    );
  }

  // 編集／新規登録モード
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {original ? "口座情報を編集" : "口座情報を登録"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="銀行名"
              name="bank_name"
              value={account.bank_name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="支店名"
              name="branch_name"
              value={account.branch_name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="支店コード"
              name="branch_code"
              value={account.branch_code}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="口座種別"
              name="account_type"
              value={account.account_type}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="口座番号"
              name="account_number"
              value={account.account_number}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="口座名義"
              name="account_holder"
              value={account.account_holder}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        {original && (
          <Button onClick={() => {
            setAccount(original);
            setIsEdit(false);
          }}>
            キャンセル
          </Button>
        )}
        <Button variant="contained" disabled={saving} onClick={handleSave}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </CardActions>
    </Card>
  );
}
