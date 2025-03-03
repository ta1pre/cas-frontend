import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#696969', // メインカラー（プライマリボタンなどに使用）
      dark: '#808080', // ホバー時などに使用
    },
    secondary: {
      main: '#dc004e', // セカンダリカラー
    },
    background: {
      default: '#fff', // 🌟 背景色
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
