// 📂 app/cast/components/layout/CastBottomNav.tsx
'use client';

import Link from 'next/link';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CreateIcon from '@mui/icons-material/Create';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getVerificationStatus } from '@/app/p/cast/cont/identity_verification/services/identityService';

export default function CastBottomNav() {
  const [value, setValue] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 本人確認ステータスを取得
    const fetchVerificationStatus = async () => {
      try {
        const response = await getVerificationStatus();
        setVerificationStatus(response?.status || 'unsubmitted');
      } catch (error) {
        console.error('本人確認ステータス取得エラー:', error);
        setVerificationStatus('error');
      }
    };
    
    fetchVerificationStatus();
    
    // ルートに合わせてBottomNavの選択状態を変更
    if (pathname.includes('/dashboard')) setValue(0);
    else if (pathname.includes('cont/reserve')) setValue(1);
    else if (pathname.includes('cont/posts')) setValue(2);
    else if (pathname.includes('/identity_verification')) setValue(3);
  }, [pathname]);
  
  // 本人確認が完了しているかどうか
  const isVerified = verificationStatus === 'approved';
  
  // 予約管理ボタンのクリックハンドラー
  const handleReserveClick = (e: React.MouseEvent) => {
    if (!isVerified) {
      e.preventDefault();
      // 本人確認ページへリダイレクト
      router.push('/p/cast/cont/identity_verification');
    }
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{ backgroundColor: '#fff0f5' }}
      >
        <BottomNavigationAction label="ホーム" icon={<HomeIcon />} component={Link} href="/p/cast/cont/dashboard" />
        <BottomNavigationAction 
          label="予約管理" 
          icon={<AssignmentIcon />} 
          component={Link} 
          href={isVerified ? "/p/cast/cont/reserve" : "#"}
          onClick={handleReserveClick}
          sx={{ 
            color: isVerified ? 'inherit' : 'rgba(0, 0, 0, 0.26)',
            '& .MuiSvgIcon-root': {
              color: isVerified ? 'inherit' : 'rgba(0, 0, 0, 0.26)'
            }
          }}
        />
        <BottomNavigationAction label="投稿" icon={<CreateIcon />} component={Link} href="/p/cast/cont/posts" />
        <BottomNavigationAction label="本人確認" icon={<VerifiedUserIcon />} component={Link} href="/p/cast/cont/identity_verification" />
      </BottomNavigation>
    </Paper>
  );
}
