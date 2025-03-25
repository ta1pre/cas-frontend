// page.tsxを日本語に変更
"use client";

import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Paper, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

const プロフィール編集ページ = () => {
  const router = useRouter();

  const プロフィールセクション = [
    { title: 'サービス種別', path: '/p/cast/cont/prof/service-category' },
    { title: '基本プロフィール', path: '/p/cast/cont/prof/basic' },
    { title: '特徴', path: '/p/cast/cont/prof/features' },
    { title: 'サービスタイプ', path: '/p/cast/cont/prof/service-type' },
    { title: 'オプション', path: '/p/cast/cont/prof/options' },
    { title: '本人確認', path: '/p/cast/cont/identity_verification' }, // 追加
  ];

  const ナビゲーション処理 = (path: string) => {
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
              <ListItemButton onClick={() => ナビゲーション処理(section.path)}>
                <ListItemText primary={section.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default プロフィール編集ページ;
