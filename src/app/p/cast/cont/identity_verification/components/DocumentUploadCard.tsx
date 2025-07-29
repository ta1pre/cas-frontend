"use client";

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  IconButton
} from '@mui/material';
import { 
  CloudUpload, 
  CheckCircle, 
  PhotoCamera,
  InsertDriveFile,
  Close
} from '@mui/icons-material';

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
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isBasicDocument = acceptedTypes.includes('運転免許証');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // 画像プレビューの生成
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // 画像プレビューの生成
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
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
        onUpload(selectedFile, 'license'); // デフォルトで運転免許証
      } else {
        onUpload(selectedFile);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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


        {/* ファイル選択状態 */}
        {selectedFile ? (
          <Box sx={{ mb: 3 }}>
            {/* プレビューまたはファイル情報 */}
            {previewUrl ? (
              <Box sx={{ position: 'relative', mb: 2 }}>
                <img 
                  src={previewUrl} 
                  alt="プレビュー" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '300px', 
                    objectFit: 'contain',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5'
                  }} 
                />
                <IconButton
                  onClick={clearSelection}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'grey.100', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <InsertDriveFile color="action" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="body1">{selectedFile.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={clearSelection}>
                  <Close />
                </IconButton>
              </Box>
            )}
          </Box>
        ) : (
          /* ファイル選択エリア（スマホ最適化） */
          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: 'none' }}
            />
            
            {/* カメラボタン（メイン） */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<PhotoCamera />}
              onClick={openFileDialog}
              sx={{ 
                mb: 2,
                py: 2,
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              写真を撮影・選択
            </Button>
            
            {/* ドラッグ&ドロップエリア（PC向け） */}
            <Box
              sx={{
                border: '2px dashed',
                borderColor: dragOver ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                backgroundColor: dragOver ? 'action.hover' : 'grey.50',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: { xs: 'none', sm: 'block' }
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={openFileDialog}
            >
              <CloudUpload sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                パソコンからドラッグ&ドロップ
              </Typography>
            </Box>
          </Box>
        )}

        {/* アップロードボタン */}
        {selectedFile && (
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isUploading}
            fullWidth
            size="large"
            sx={{ 
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {isUploading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                アップロード中...
              </>
            ) : (
              'アップロードする'
            )}
          </Button>
        )}

        {/* 注意事項（コンパクトに） */}
        <Alert severity="info" sx={{ mt: 2 }} icon={false}>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            📌 ファイルは10MB以下<br />
            📌 文字がはっきり読める画質で<br />
            📌 書類全体が写るように撮影
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}