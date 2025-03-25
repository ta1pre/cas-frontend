import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { uploadFile } from '../services/identityService';

interface FileUploadBoxProps {
  title: string;
  description: string;
  onFileChange: (file: File | null, fileUrl?: string, mediaId?: number) => void;
  error?: string;
  orderIndex: number;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({ 
  title, 
  description, 
  onFileChange, 
  error,
  orderIndex
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [mediaId, setMediaId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      
      try {
        setIsUploading(true);
        
        // ファイルをアップロードする
        const uploadResult = await uploadFile(selectedFile, orderIndex);
        
        console.log(`✅ FileUploadBox - アップロード成功:`, uploadResult);
        
        // ファイルURLとメディアIDを保存
        setFileUrl(uploadResult.fileUrl);
        setMediaId(uploadResult.mediaId);
        setIsUploaded(true);
        
        console.log(`✅ FileUploadBox - アップロード完了: mediaId=${uploadResult.mediaId}, orderIndex=${orderIndex}`);
        
        // メディアIDも親コンポーネントに渡す
        onFileChange(selectedFile, uploadResult.fileUrl, uploadResult.mediaId);
      } catch (error) {
        console.error('ファイルアップロードエラー:', error);
        alert('ファイルのアップロードに失敗しました。もう一度お試しください。');
        setFile(null);
        onFileChange(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <input
            type="file"
            accept="image/*,.pdf"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
          
          <Button
            variant="contained"
            color={isUploaded ? "success" : "primary"}
            startIcon={isUploaded ? <CheckCircleIcon /> : <CloudUploadIcon />}
            onClick={handleButtonClick}
            disabled={isUploading}
            sx={{ mr: 2 }}
          >
            {isUploading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                アップロード中...
              </>
            ) : isUploaded ? (
              'アップロード済み'
            ) : (
              'ファイルを選択'
            )}
          </Button>
          
          {file && !isUploading && (
            <Typography variant="body2" color="text.secondary">
              {file.name} ({Math.round(file.size / 1024)} KB)
            </Typography>
          )}
        </Box>
        
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default FileUploadBox;
