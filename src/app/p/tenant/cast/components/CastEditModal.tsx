"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";
import { Cast } from "../types/castTypes";

interface CastEditModalProps {
  open: boolean;
  onClose: () => void;
  cast: Cast | null;
  onSave: (values: { cast_id: number; nick_name: string }) => Promise<void>;
}

const CastEditModal: React.FC<CastEditModalProps> = ({ open, onClose, cast, onSave }) => {
  const [nickName, setNickName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cast) {
      setNickName(cast.name || "");
    } else {
      setNickName("");
    }
    setError("");
  }, [cast, open]);

  const handleSave = async () => {
    if (!nickName.trim()) {
      setError("名前を入力してください");
      return;
    }
    setSaving(true);
    try {
      await onSave({ cast_id: cast!.id, nick_name: nickName });
      onClose();
    } catch (e) {
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>プロフィール編集</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <TextField
            label="名前"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            fullWidth
            autoFocus
            inputProps={{ maxLength: 30 }}
            error={!!error}
            helperText={error || ""}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={saving}>
          キャンセル
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={saving} sx={{ bgcolor: "#FF80AB", '&:hover': { bgcolor: "#FF4081" } }}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CastEditModal;
