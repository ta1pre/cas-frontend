"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, RadioGroup, FormControlLabel, Radio, FormLabel, Grid } from "@mui/material";
import { Cast } from "../types/castTypes";
import { SaveCastData } from '../api/cast';
import PrefectureSelect from '@/app/p/cast/cont/prof/components/PrefectureSelect'; // PrefectureSelectコンポーネントのインポートパスを修正
import StationAutocomplete from '@/app/p/cast/cont/prof/components/StationAutocomplete';

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
  const [supportArea, setSupportArea] = useState<string>(cast?.support_area || ''); // supportAreaの初期値を設定
  const [reservationFeeDeli, setReservationFeeDeli] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState<0 | 1>(1);
  const [stationName, setStationName] = useState(cast?.station_name || '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cast) {
      setName(cast.name ?? "");
      setAge(cast.age ?? 0);
      setHeight(cast.height ?? 0);
      setBust(cast.bust ?? 0);
      setWaist(cast.waist ?? 0);
      setHip(cast.hip ?? 0);
      setCup(cast.cup ?? "");
      setBirthplace(cast.birthplace ?? "");
      setBloodType(cast.blood_type ?? "");
      setHobby(cast.hobby ?? "");
      setSelfIntroduction(cast.self_introduction ?? "");
      setJob(cast.job ?? "");
      setDispatchPrefecture(cast.dispatch_prefecture ?? "");
      setSupportArea(cast.support_area ?? "");
      setReservationFeeDeli(cast.reservation_fee_deli ?? 0);
      setIsActive(cast.is_active === 0 ? 0 : 1);
      setStationName(cast.station_name ?? "");
    } else {
      setName(""); 
      setAge(0); 
      setHeight(0); 
      setBust(0); 
      setWaist(0); 
      setHip(0); 
      setCup(""); 
      setBirthplace(""); 
      setBloodType(""); 
      setHobby(""); 
      setSelfIntroduction(""); 
      setJob(""); 
      setDispatchPrefecture(""); 
      setSupportArea(''); 
      setReservationFeeDeli(0); 
      setIsActive(1); 
      setStationName('');
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
          station_name: stationName,
        }
      });
      onClose();
    } catch (e) {
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleSupportAreaChange = (event: any) => { // handleSupportAreaChange関数を追加
    setSupportArea(event.target.value);
  };

  const handleStationChange = (name: string, id?: number) => {
    setStationName(name);
    setDispatchPrefecture(id?.toString() || '');
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
              <StationAutocomplete
                value={stationName}
                stationId={dispatchPrefecture ? Number(dispatchPrefecture) : undefined}
                onChange={handleStationChange}
                label="最寄り駅"
                helperText="活動拠点の最寄り駅を選択してください"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <PrefectureSelect // PrefectureSelectコンポーネントを追加
                value={supportArea}
                onChange={handleSupportAreaChange}
                label="サポートエリア"
                helperText="活動可能な都道府県を選択してください"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="時間単価" type="number" value={reservationFeeDeli ?? ''} onChange={e => setReservationFeeDeli(Number(e.target.value)||undefined)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <FormLabel component="legend">掲載ステータス</FormLabel>
              <RadioGroup row value={isActive} onChange={e => setIsActive(Number(e.target.value) as 0 | 1)}>
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
