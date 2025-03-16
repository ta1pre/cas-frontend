import { useState, useEffect } from 'react';
import { useSetupStorage } from './useSetupStorage';

export function useSetupNavigation() {
    const { getStorage, setStorage } = useSetupStorage();
    const [setupStatus, setSetupStatus] = useState<string | null>(null);

    useEffect(() => {
        const savedStatus = getStorage('setup_status');
        setSetupStatus(savedStatus || 'empty');
    }, []);

    const updateStatus = (newStatus: string) => {
        setSetupStatus(newStatus);
        setStorage('setup_status', newStatus);
    };

    // ✅ 戻る処理（user_type による分岐を追加）
    const handlePrevStep = () => {
        const userType = getStorage('user_type'); // ✅ カスタマーかキャストかを判定

        switch (setupStatus) {
            case 'sex_selection':
                updateStatus('empty');
                break;
            case 'customer_profile':
                updateStatus('sex_selection'); // ✅ カスタマーは `sex_selection` に戻る
                break;
            case 'cast_name':
                updateStatus('sex_selection'); // ✅ キャストも `sex_selection` に戻る
                break;
            case 'cast_photo':
                updateStatus('cast_name'); // ✅ キャスト名入力に戻る
                break;
            case 'cast_age':
                updateStatus('cast_photo'); // ✅ 写真登録に戻る
                break;
            case 'cast_height':
                updateStatus('cast_age'); // ✅ 年齢入力に戻る
                break;
            case 'cast_traits':
                updateStatus('cast_height'); // ✅ 身長入力に戻る
                break;
            case 'service_selection':
                updateStatus('cast_traits'); // ✅ 特徴選択に戻る
                break;
            case 'sms_verification':
                updateStatus(userType === 'customer' ? 'customer_profile' : 'service_selection'); // ✅ ユーザータイプによる分岐
                break;
            case 'completed':
                updateStatus('sms_verification');
                break;
            default:
                break;
        }
    };

    return { setupStatus, setSetupStatus: updateStatus, handlePrevStep };
}
