import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface ProfileEditCardProps {
  title: string;
  children: React.ReactNode;
}

const ProfileEditCard: React.FC<ProfileEditCardProps> = ({ title, children }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <Box>
        {children}
      </Box>
    </Paper>
  );
};

export default ProfileEditCard;
