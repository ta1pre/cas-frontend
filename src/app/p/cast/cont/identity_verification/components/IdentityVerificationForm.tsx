"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import FileUploadBox from "./FileUploadBox";
import {
  submitVerification,
} from "../services/identityService";

interface IdentityVerificationFormProps {
  /** 提出成功時のコールバック (次のステップへ遷移させるなど) */
  onSubmitSuccess: () => void;
  /** サービス種別 (A/B) のデフォルト値 */
  defaultServiceType?: string;
  /** true の場合、サービス種別のセレクトを表示しない */
  hideServiceTypeSelection?: boolean;
}

const IdentityVerificationForm: React.FC<IdentityVerificationFormProps> = ({
  onSubmitSuccess,
  defaultServiceType = "A",
  hideServiceTypeSelection = false,
}) => {
  /* ------------------------------ state ------------------------------ */
  const [serviceType, setServiceType] = useState<string>(defaultServiceType);
  // アップロード済みメディアID
  const [idPhotoMediaId, setIdPhotoMediaId] = useState<number | null>(null);
  const [juminhyoMediaId, setJuminhyoMediaId] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* ---------------------------- handlers ----------------------------- */
  const handleSubmit = async () => {
    if (!idPhotoMediaId) {
      setErrorMessage("身分証画像をアップロードしてください");
      return;
    }
    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      await submitVerification({
        service_type: serviceType,
        id_photo_media_id: idPhotoMediaId,
        juminhyo_media_id: juminhyoMediaId ?? null,
      });
      onSubmitSuccess();
    } catch (e) {
      console.error("submitVerification error", e);
      setErrorMessage("申請に失敗しました。再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {!hideServiceTypeSelection && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="service-type-label">サービス種別</InputLabel>
          <Select
            labelId="service-type-label"
            value={serviceType}
            label="サービス種別"
            onChange={(e) => setServiceType(e.target.value)}
          >
            <MenuItem value="A">通常キャスト (A)</MenuItem>
            <MenuItem value="B">高収入キャスト (B)</MenuItem>
          </Select>
        </FormControl>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <FileUploadBox
            title="身分証明書 (必須)"
            description="運転免許証・マイナンバーカード・パスポートなど。鮮明な画像をご用意ください。"
            orderIndex={0}
            onFileChange={(_, __, mediaId) => setIdPhotoMediaId(mediaId ?? null)}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUploadBox
            title="住民票 (任意)"
            description="提出すると審査がスムーズになります。PDF または 画像ファイルをアップロードしてください。"
            orderIndex={1}
            onFileChange={(_, __, mediaId) => setJuminhyoMediaId(mediaId ?? null)}
          />
        </Grid>
      </Grid>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> 申請中...
          </>
        ) : (
          "申請する"
        )}
      </Button>
    </Box>
  );
};

export default IdentityVerificationForm;
