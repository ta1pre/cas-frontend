"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, RadioGroup, FormControlLabel, Radio, FormLabel, Grid } from "@mui/material";
import { Cast } from "../types/castTypes";
import { SaveCastData } from '../api/cast';

interface CastEditModalProps {
  open: boolean;
  onClose: () => void;
  cast: Cast | null;
  onSave: (values: SaveCastData) => Promise<void>;
}

const CastEditModal: React.FC<CastEditModalProps> = ({ open, onClose, cast, onSave }) => {
  // 各項目のstate
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [bust, setBust] = useState<number | undefined>(undefined);
  const [waist, setWaist] = useState<number | undefined>(undefined);
  const [hip, setHip] = useState<number | undefined>(undefined);
  const [cup, setCup] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [hobby, setHobby] = useState("");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [job, setJob] = useState("");
  const [dispatchPrefecture, setDispatchPrefecture] = useState("");
  const [supportArea, setSupportArea] = useState("");
  const [reservationFeeDeli, setReservationFeeDeli] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState<1 | 0>(1);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cast) {
      setName(cast.name || "");
      setAge((cast as any).age ?? undefined);
      setHeight((cast as any).height ?? undefined);
      setBust((cast as any).bust ?? undefined);
      setWaist((cast as any).waist ?? undefined);
      setHip((cast as any).hip ?? undefined);
      setCup((cast as any).cup ?? "");
      setBirthplace((cast as any).birthplace ?? "");
      setBloodType((cast as any).blood_type ?? "");
      setHobby((cast as any).hobby ?? "");
      setSelfIntroduction((cast as any).self_introduction ?? "");
      setJob((cast as any).job ?? "");
      setDispatchPrefecture((cast as any).dispatch_prefecture ?? "");
      setSupportArea((cast as any).support_area ?? "");
      setReservationFeeDeli((cast as any).reservation_fee_deli ?? undefined);
      setIsActive((cast as any).is_active ?? 1);
    } else {
      setName(""); setAge(undefined); setHeight(undefined); setBust(undefined); setWaist(undefined); setHip(undefined); setCup(""); setBirthplace(""); setBloodType(""); setHobby(""); setSelfIntroduction(""); setJob(""); setDispatchPrefecture(""); setSupportArea(""); setReservationFeeDeli(undefined); setIsActive(1);
    }
    setError("");
  }, [cast, open]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("名前を入力してください");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        cast_id: cast ? cast.id : undefined,
        cast: {
          name,
          age,
          height,
          bust,
          cup,
          waist,
          hip,
          birthplace,
          blood_type: bloodType,
          hobby,
          self_introduction: selfIntroduction,
          job,
          dispatch_prefecture: dispatchPrefecture,
          support_area: supportArea,
          reservation_fee_deli: reservationFeeDeli,
          is_active: isActive,
          cast_type: 'B',
        }
      });
      onClose();
    } catch (e) {
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>プロフィール編集</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="名前" value={name} onChange={e => setName(e.target.value)} fullWidth autoFocus inputProps={{ maxLength: 30 }} error={!!error} helperText={error || ""} sx={{ mb: 1 }} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="年齢" type="number" value={age ?? ''} onChange={e => setAge(Number(e.target.value)||undefined)} fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="身長(cm)" type="number" value={height ?? ''} onChange={e => setHeight(Number(e.target.value)||undefined)} fullWidth />
            </Grid>
            <Grid item xs={4} sm={2}>
              <TextField label="バスト" type="number" value={bust ?? ''} onChange={e => setBust(Number(e.target.value)||undefined)} fullWidth />
            </Grid>
            <Grid item xs={4} sm={2}>
              <TextField label="ウエスト" type="number" value={waist ?? ''} onChange={e => setWaist(Number(e.target.value)||undefined)} fullWidth />
            </Grid>
            <Grid item xs={4} sm={2}>
              <TextField label="ヒップ" type="number" value={hip ?? ''} onChange={e => setHip(Number(e.target.value)||undefined)} fullWidth />
            </Grid>
            <Grid item xs={4} sm={2}>
              <TextField label="カップ" value={cup} onChange={e => setCup(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField label="出身地" value={birthplace} onChange={e => setBirthplace(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField label="血液型" value={bloodType} onChange={e => setBloodType(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="趣味" value={hobby} onChange={e => setHobby(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="自己紹介" value={selfIntroduction} onChange={e => setSelfIntroduction(e.target.value)} fullWidth multiline rows={2} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="職業" value={job} onChange={e => setJob(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="派遣都道府県" value={dispatchPrefecture} onChange={e => setDispatchPrefecture(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="対応エリア" value={supportArea} onChange={e => setSupportArea(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="時間単価" type="number" value={reservationFeeDeli ?? ''} onChange={e => setReservationFeeDeli(Number(e.target.value)||undefined)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <FormLabel component="legend">掲載ステータス</FormLabel>
              <RadioGroup row value={isActive} onChange={e => setIsActive(Number(e.target.value) as 1 | 0)}>
                <FormControlLabel value={1} control={<Radio color="primary" />} label="掲載" />
                <FormControlLabel value={0} control={<Radio color="secondary" />} label="非掲載" />
              </RadioGroup>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={saving}>
          キャンセル
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={saving}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CastEditModal;
