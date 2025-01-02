'use client';
import React from 'react';
import { Typography } from '@mui/material';

export default function UserPage() {
  return (
    <div>
      <Typography variant="h4">ユーザーページ</Typography>
      <Typography variant="body1">
        このページは /dashboard/user で表示されます！
      </Typography>
    </div>
  );
}
