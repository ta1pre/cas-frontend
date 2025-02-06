'use client';

import React, { useState } from 'react';

interface CastProfileStepProps {
    onNextStep: () => void;
    onPrevStep: () => void;
}

export default function CastProfileStep({ onNextStep, onPrevStep }: CastProfileStepProps) {
    const [profile, setProfile] = useState({
        nickname: '',
        bio: '',
        skills: '',
        profilePicture: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfile({ ...profile, profilePicture: e.target.files[0] });
        }
    };

    const handleSubmit = () => {
        if (!profile.nickname || !profile.bio) {
            alert('必須項目を入力してください。');
            return;
        }

        console.log('プロフィールデータ:', profile);
        onNextStep();
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>キャストプロフィール設定</h2>
            <form>
                <div style={{ marginBottom: '20px' }}>
                    <label>
                        ニックネーム (必須):
                        <input
                            type="text"
                            value={profile.nickname}
                            onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                            placeholder="ニックネーム"
                            required
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        自己紹介 (必須):
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="自己紹介を入力してください。"
                            required
                        ></textarea>
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        スキルや資格 (任意):
                        <input
                            type="text"
                            value={profile.skills}
                            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                            placeholder="例: マッサージ資格、アロマ資格など"
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>
                        プロフィール写真 (任意):
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </label>
                    {profile.profilePicture && (
                        <p>選択されたファイル: {profile.profilePicture.name}</p>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" onClick={onPrevStep} style={{ padding: '10px 20px' }}>
                        戻る
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4caf50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        次へ
                    </button>
                </div>
            </form>
        </div>
    );
}
