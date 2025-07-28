"use client";

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { CloudUpload, CheckCircle } from '@mui/icons-material';

interface DocumentUploadCardProps {
  title: string;
  subtitle: string;
  acceptedTypes: string[];
  onUpload: (file: File, documentType?: string) => void;
  isUploading?: boolean;
  uploadedFile?: {
    uploaded: boolean;
    uploaded_at?: string | null;
    file_name?: string | null;
  };
}

export default function DocumentUploadCard({
  title,
  subtitle,
  acceptedTypes,
  onUpload,
  isUploading = false,
  uploadedFile
}: DocumentUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('license');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBasicDocument = acceptedTypes.includes('運転免許証');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUpload = () => {
    if (selectedFile) {
      if (isBasicDocument) {
        onUpload(selectedFile, documentType);
      } else {
        onUpload(selectedFile);
      }
      setSelectedFile(null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // 既にアップロード済みの場合
  if (uploadedFile?.uploaded) {
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CheckCircle color="success" sx={{ mr: 1 }} />
            <Typography variant="h6" color="success.main">
              {title} - アップロード完了
            </Typography>
          </Box>
          
          <Alert severity="success">
            ファイルが正常にアップロードされました
            {uploadedFile.file_name && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                ファイル名: {uploadedFile.file_name}
              </Typography>
            )}
            {uploadedFile.uploaded_at && (
              <Typography variant="body2">
                アップロード日時: {new Date(uploadedFile.uploaded_at).toLocaleString()}
              </Typography>
            )}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>

        {/* 受け入れ可能なファイルタイプ */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            対応ファイル形式:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {acceptedTypes.map((type, index) => (
              <Chip key={index} label={type} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>

        {/* 基本身分証の場合は書類タイプ選択 */}
        {isBasicDocument && (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">身分証の種類</FormLabel>
            <RadioGroup
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              row
            >
              <FormControlLabel value="license" control={<Radio />} label="運転免許証" />
              <FormControlLabel value="mynumber" control={<Radio />} label="マイナンバーカード" />
              <FormControlLabel value="passport" control={<Radio />} label="パスポート" />
              <FormControlLabel value="basic_resident_card" control={<Radio />} label="住民基本台帳カード" />
            </RadioGroup>
          </FormControl>
        )}

        {/* ファイルドロップエリア */}
        <Box
          sx={{
            border: '2px dashed',
            borderColor: dragOver ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: dragOver ? 'action.hover' : 'transparent',
            cursor: 'pointer',
            mb: 2,
            transition: 'all 0.2s ease'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.pdf"
            style={{ display: 'none' }}
          />
          
          <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          
          {selectedFile ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                選択されたファイル: {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                サイズ: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" gutterBottom>
                ファイルをドラッグ&ドロップ または クリックして選択
              </Typography>
              <Typography variant="body2" color="text.secondary">
                JPG, PNG, PDF形式（最大10MB）
              </Typography>
            </Box>
          )}
        </Box>

        {/* アップロードボタン */}
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isUploading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              アップロード中...
            </>
          ) : (
            'アップロード'
          )}
        </Button>

        {/* 注意事項 */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            • ファイルサイズは10MB以下にしてください<br />
            • 文字がはっきりと読める画質でアップロードしてください<br />
            • 書類全体が写るように撮影してください
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}