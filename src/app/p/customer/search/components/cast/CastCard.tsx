import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Cast } from "../../api/cast/castTypes";

interface CastCardProps {
    cast: Cast;
}

const CastCard: React.FC<CastCardProps> = ({ cast }) => {
    const imageUrl = cast.profile_image_url || "/default-avatar.png";

    return (
        <Card className="w-full sm:w-full md:w-5/6 lg:w-3/4 mx-auto shadow-md border border-gray-200">
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-lg">
                <img 
                    src={imageUrl} 
                    alt={cast.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
            </div>
            <CardContent className="p-2 sm:p-4">
                <Typography variant="h6" className="font-bold text-center">{cast.name || "名前未設定"}</Typography>
                <Typography variant="body2" className="text-center">年齢: {cast.age ? `${cast.age}歳` : "情報なし"}</Typography>
                <Typography variant="body2" className="text-center">身長: {cast.height ? `${cast.height} cm` : "未設定"}</Typography>
                {cast.available_at ? (
                    <Typography variant="body2" className="text-green-500 text-center">🟢 今すぐOK</Typography>
                ) : (
                    <Typography variant="body2" className="text-gray-500 text-center">受付時間未設定</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default CastCard;
