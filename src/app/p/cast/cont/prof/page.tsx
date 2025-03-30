// page.tsxを日本語に変更
"use client";

import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Paper, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import SlideInEditor from './components/SlideInEditor';
import BasicProfileForm from './components/BasicProfileForm';

const プロフィール編集ページ = () => {
  const router = useRouter();
  const [slideInOpen, setSlideInOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const プロフィールセクション = [
    { title: '基本プロフィール', path: '/p/cast/cont/prof/basic', key: 'basic' },
    { title: '特徴', path: '/p/cast/cont/prof/features', key: 'features' },
    { title: 'サービスタイプ', path: '/p/cast/cont/prof/service-type', key: 'service-type' },
    { title: 'オプション', path: '/p/cast/cont/prof/options', key: 'options' },
    { title: '本人確認', path: '/p/cast/cont/identity_verification', key: 'identity' },
  ];

  const ナビゲーション処理 = (path: string, key: string) => {
    // 基本プロフィールの場合はスライドインを表示
    if (key === 'basic') {
      setActiveForm('basic');
      setSlideInOpen(true);
      return;
    }
    // その他のメニューは通常通りルーティング
    router.push(path);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          プロフィール編集
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          編集したい項目を選択してください
        </Typography>
        
        <List component="nav" aria-label="プロフィール編集セクション">
          {プロフィールセクション.map((section, index) => (
            <ListItem key={index} disablePadding divider={index < プロフィールセクション.length - 1}>
              <ListItemButton onClick={() => ナビゲーション処理(section.path, section.key)}>
                <ListItemText primary={section.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* スライドインエディター */}
      <SlideInEditor 
        open={slideInOpen} 
        onClose={() => setSlideInOpen(false)}
        title={activeForm === 'basic' ? '基本プロフィール編集' : ''}
      >
        {activeForm === 'basic' && <BasicProfileForm onClose={() => setSlideInOpen(false)} />}
      </SlideInEditor>
    </Container>
  );
};

export default プロフィール編集ページ;
