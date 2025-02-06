import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // メインカラー（プライマリボタンなどに使用）
    },
    secondary: {
      main: '#dc004e', // セカンダリカラー
    },
    background: {
      default: '#c2c1d4', // 🌟 背景色
      paper: '#ffffff',   // 🌟 カードやダイアログの背景色
    },
    text: {
      primary: '#212121', // テキストのメインカラー
      secondary: '#757575', // テキストのサブカラー
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // フォントスタイル
  },
});

export default theme;
