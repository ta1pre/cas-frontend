import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { fetchAPI } from '@/services/auth/axiosInterceptor';

export default function AvailableButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateAvailable = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const response = await fetchAPI('/api/v1/cast/available/update', {}, 'POST');
      setSuccess('受付開始しました！');
    } catch (e: any) {
      setError('受付開始に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <Button
        variant="contained"
        sx={{
          bgcolor: '#ff69b4',
          color: 'white',
          borderRadius: 2,
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          boxShadow: 'none',
          '&:hover': { bgcolor: '#ff80ab' },
        }}
        onClick={handleUpdateAvailable}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '受付開始する！'}
      </Button>
      {success && <p className="text-pink-500 mt-2">{success}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
