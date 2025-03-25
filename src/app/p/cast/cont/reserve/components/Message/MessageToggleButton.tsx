import React from 'react';
import { Box, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

export default function MessageToggleButton({ isOpen, onClick }: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        backgroundColor: isOpen ? '#f5f5f5' : '#f06292',
        color: isOpen ? '#333' : 'white',
        borderRadius: isOpen ? '8px 8px 0 0' : '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: isOpen ? '#e0e0e0' : '#e91e63',
        },
      }}
    >
      <ChatIcon sx={{ marginRight: 1 }} />
      <Typography variant="body1" fontWeight="medium">
        メッセージ
      </Typography>
      {isOpen && <KeyboardArrowDownIcon sx={{ marginLeft: 1 }} />}
    </Box>
  );
}
