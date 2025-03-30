import React, { ReactNode } from 'react';
import { 
  Drawer, 
  IconButton, 
  Typography, 
  Box, 
  Divider,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SlideInEditorProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const SlideInEditor: React.FC<SlideInEditorProps> = ({ 
  open, 
  onClose, 
  title, 
  children 
}) => {
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '80%', md: '60%' },
          maxWidth: '800px',
          p: 2,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <IconButton onClick={onClose} edge="end" aria-label="閉じる">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        {children}
      </Box>
    </Drawer>
  );
};

export default SlideInEditor;
