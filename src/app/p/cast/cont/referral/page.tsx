'use client';
import React, { useEffect, useState } from 'react';
import ReferralCodeCard from './components/ReferralCodeCard';
import { getReferralCode } from './api/getReferralCode';
import CircularProgress from '@mui/material/CircularProgress';

const ReferralPage: React.FC = () => {
  const [invitationId, setInvitationId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const code = await getReferralCode();
      setInvitationId(code);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-2xl md:text-3xl font-bold text-pink-500 mb-4 mt-8">紹介コード</h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        お友達に紹介コードをシェアして、素敵な特典をゲットしよう！
      </p>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <ReferralCodeCard invitationId={invitationId} />
      )}
    </div>
  );
};

export default ReferralPage;
