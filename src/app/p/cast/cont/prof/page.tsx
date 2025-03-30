// page.tsxの日本語に変更
"use client";

import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Paper, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import SlideInEditor from './components/SlideInEditor';
import BasicProfileForm from './components/BasicProfileForm';
import PhotoUploadForm from './components/PhotoUploadForm';
import TraitsForm from './components/TraitsForm';
import ServiceTypeForm from './components/ServiceTypeForm';
import PhotoIcon from '@mui/icons-material/Photo';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// プロフィール編集ページコンポーネント
const プロフィール編集ページ = () => {
  const router = useRouter();
  const [slideInOpen, setSlideInOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);

  // プロフィール編集メニュー項目
  const プロフィールセクション = [
    { title: '基本プロフィール', path: '/p/cast/cont/prof/basic', key: 'basic', icon: <PersonIcon sx={{ color: '#ff69b4', mr: 1 }} /> },
    { title: '写真登録', path: '/p/cast/cont/prof/photos', key: 'photos', icon: <PhotoIcon sx={{ color: '#ff69b4', mr: 1 }} /> },
    { title: '特徴', path: '/p/cast/cont/prof/features', key: 'features', icon: <CategoryIcon sx={{ color: '#ff69b4', mr: 1 }} /> },
    { title: 'サービスタイプ', path: '/p/cast/cont/prof/service-type', key: 'service-type', icon: <MiscellaneousServicesIcon sx={{ color: '#ff69b4', mr: 1 }} /> },
    { title: '本人確認', path: '/p/cast/cont/identity_verification', key: 'identity', icon: <VerifiedUserIcon sx={{ color: '#ff69b4', mr: 1 }} /> },
  ];

  // メニュー項目クリック時の処理
  const ナビゲーション処理 = (path: string, key: string) => {
    // 基本プロフィールの場合はスライドインを表示
    if (key === 'basic') {
      setActiveForm('basic');
      setSlideInOpen(true);
      return;
    }
    // 写真の場合もスライドインを表示
    if (key === 'photos') {
      setActiveForm('photos');
      setSlideInOpen(true);
      return;
    }
    // 特徴の場合もスライドインを表示
    if (key === 'features') {
      setActiveForm('features');
      setSlideInOpen(true);
      return;
    }
    // サービスタイプの場合もスライドインを表示
    if (key === 'service-type') {
      setActiveForm('service-type');
      setSlideInOpen(true);
      return;
    }
    // その他のメニューは通常通りルーティング
    router.push(path);
  };

  // スライドインを閉じる処理
  const handleClose = () => {
    setSlideInOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
          プロフィール編集
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          編集したい項目を選択してください
        </Typography>
        
        <List component="nav" aria-label="プロフィール編集セクション" sx={{ bgcolor: '#fff0f5', borderRadius: 2 }}>
          {プロフィールセクション.map((section, index) => (
            <ListItem key={index} disablePadding divider={index < プロフィールセクション.length - 1}>
              <ListItemButton 
                onClick={() => ナビゲーション処理(section.path, section.key)}
                sx={{ 
                  py: 1.5,
                  '&:hover': { bgcolor: 'rgba(255, 105, 180, 0.1)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {section.icon}
                  <ListItemText primary={section.title} />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* スライドインエディター */}
      <SlideInEditor 
        open={slideInOpen} 
        onClose={handleClose}
        title={activeForm === 'basic' ? '基本プロフィール編集' : 
              activeForm === 'photos' ? '写真登録' :
              activeForm === 'features' ? '特徴編集' : 
              activeForm === 'service-type' ? 'サービスタイプ編集' : ''}
      >
        {activeForm === 'basic' && <BasicProfileForm onClose={handleClose} />}
        {activeForm === 'photos' && <PhotoUploadForm onClose={handleClose} />}
        {activeForm === 'features' && <TraitsForm onClose={handleClose} />}
        {activeForm === 'service-type' && <ServiceTypeForm onClose={handleClose} />}
      </SlideInEditor>
    </Container>
  );
};

export default プロフィール編集ページ;
