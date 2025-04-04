'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { updateNickname, fetchUserProfile } from '../../api/nickname';

export default function NicknameForm() {
  const [nickname, setNickname] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 初期データの取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await fetchUserProfile();
        if (userData && userData.nick_name) {
          setNickname(userData.nick_name);
          setOriginalNickname(userData.nick_name);
        }
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました', error);
        setMessage({ type: 'error', text: 'ユーザー情報の取得に失敗しました' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!nickname.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await updateNickname(nickname);
      
      if (response) {
        setMessage({ type: 'success', text: 'ニックネームを更新しました' });
        setOriginalNickname(nickname);
      }
    } catch (error) {
      console.error('ニックネームの更新に失敗しました', error);
      setMessage({ type: 'error', text: 'ニックネームの更新に失敗しました' });
    } finally {
      setIsLoading(false);
    }
  };

  const isChanged = nickname !== originalNickname;

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        ニックネーム設定
      </Typography>
      
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="ニックネーム"
          variant="outlined"
          required
          fullWidth
          value={nickname}
          onChange={handleChange}
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading || !nickname.trim() || !isChanged}
          sx={{ 
            mt: 1,
            bgcolor: '#FF80AB',
            '&:hover': {
              bgcolor: '#FF4081',
            }
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : '更新する'}
        </Button>
      </Box>
    </Box>
  );
}
