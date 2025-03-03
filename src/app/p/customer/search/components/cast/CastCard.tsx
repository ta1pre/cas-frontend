// src/app/p/customer/search/components/cast/CastCard.tsx
import React from "react";
import { Cast } from "../../api/cast/getCasts";

interface CastCardProps {
    cast: Cast;
}

const CastCard: React.FC<CastCardProps> = ({ cast }) => {
    const imageUrl = cast.profile_image_url 
        ? cast.profile_image_url 
        : "/default-avatar.png";

    return (
        <div className="cast-card">
            <img 
                src={imageUrl} 
                alt={cast.name} 
                className="cast-image"
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
            />
            <div className="cast-info">
                <h3>{cast.name || "名前未設定"}</h3>
                <p>年齢: {cast.age ? `${cast.age}歳` : "情報なし"}</p>
                <p>身長: {cast.height ? `${cast.height} cm` : "未設定"}</p>
                <p>スリーサイズ: 
                    {cast.bust && cast.waist && cast.hip 
                        ? `${cast.bust}-${cast.waist}-${cast.hip} cm` 
                        : "未設定"}
                </p>
                <p>カップ: {cast.cup || "不明"}</p>
                <p>出身地: {cast.birthplace || "未設定"}</p>
                <p>対応エリア: {cast.support_area || "未設定"}</p>
                <p>血液型: {cast.blood_type || "不明"}</p>
                <p>趣味: {cast.hobby || "なし"}</p>
                <p>職業: {cast.job || "不明"}</p>
                <p>料金: {cast.reservation_fee ? `${cast.reservation_fee.toLocaleString()}円` : "未設定"}</p>
                <p>評価: {cast.rating ? `${cast.rating.toFixed(1)} / 5.0` : "評価なし"}</p>
                <p>人気度: {cast.popularity || "不明"}</p>
                {cast.available_at ? <p className="available-now">🟢 今すぐOK</p> : <p>受付時間未設定</p>}
            </div>
        </div>
    );
};

export default CastCard;
