'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { getIdentityDocs, IdentityDoc } from '@/api/admin/identity';
import IdentityImageGrid from '@/components/IdentityImageGrid';

export default function AdminCastIdentityPage() {
  const { castId } = useParams<{ castId: string }>();
  const [docs, setDocs] = useState<IdentityDoc[] | null>(null);

  useEffect(() => {
    if (!castId) return;
    (async () => {
      const res = await getIdentityDocs(Number(castId));
      setDocs(res ?? []);
    })();
  }, [castId]);

  if (!docs) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Typography variant="h5" className="mb-4 font-semibold text-pink-600">
        身分証画像一覧（{castId}）
      </Typography>
      {docs.length === 0 ? (
        <Typography>画像は登録されていません。</Typography>
      ) : (
        <IdentityImageGrid docs={docs} />
      )}
    </div>
  );
}
