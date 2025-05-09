'use client';
import React, { useEffect, useState } from 'react';
import ReferralCodeCard from './components/ReferralCodeCard';
import { getReferralCode } from './api/getReferralCode';
import { getInvitees, Invitee } from './api/getInvitees';
import InviteeList from './components/InviteeList';
import CircularProgress from '@mui/material/CircularProgress';

const ReferralPage: React.FC = () => {
  const [invitationId, setInvitationId] = useState<string>('');
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [code, inviteeList] = await Promise.all([
        getReferralCode(),
        getInvitees()
      ]);
      setInvitationId(code);
      setInvitees(inviteeList);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <h1 className="text-2xl md:text-3xl font-bold text-pink-500 mb-4 mt-8">紹介プログラム</h1>
      <p className="text-gray-500 mb-6 text-left max-w-md">
        お友達にURLをシェアして、ポイントゲット！！<br />
        初回出勤で5,000P、その後は売上の10%がずっと貰えます！<br />
        もちろん、お友達の報酬は一切引かれません。
      </p>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <>
          <ReferralCodeCard invitationId={invitationId} />
          <InviteeList invitees={invitees} />
        </>
      )}
    </div>
  );
};

export default ReferralPage;
