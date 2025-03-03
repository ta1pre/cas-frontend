import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Cast } from "../../api/cast/castTypes";

interface CastCardProps {
    cast: Cast;
}

const CastCard: React.FC<CastCardProps> = ({ cast }) => {
    const imageUrl = cast.profile_image_url || "/default-avatar.png";

    const jobRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const [isJobOverflow, setIsJobOverflow] = useState(false);
    const [isIntroOverflow, setIsIntroOverflow] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            if (jobRef.current) {
                setIsJobOverflow(jobRef.current.scrollWidth > jobRef.current.clientWidth);
            }
            if (introRef.current) {
                setIsIntroOverflow(introRef.current.scrollWidth > introRef.current.clientWidth);
            }
        }, 100);
    }, []);

    return (
        <Card className="w-full sm:w-full md:w-5/6 lg:w-3/4 mx-auto shadow-md border border-gray-200">
            {/* 画像エリア */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-lg">
                <img 
                    src={imageUrl} 
                    alt={cast.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
            </div>

            {/* カードのコンテンツ（左寄せ） */}
            <CardContent className="p-2 sm:p-4 text-left">
                {/* 名前 */}
                <Typography variant="h6" className="font-bold">{cast.name || "名前未設定"}</Typography>

                {/* 年齢 / 身長 / 職業（フェードアウト適用） */}
                <div
                    ref={jobRef}
                    className="overflow-hidden whitespace-nowrap"
                    style={
                        isJobOverflow
                            ? {
                                maskImage: "linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 98%)",
                                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 98%)",
                            }
                            : {}
                    }
                >
                    <Typography variant="body2" className="text-gray-700">
                        {cast.age ? `${cast.age}歳` : "年齢不明"} / {cast.height ? `${cast.height}cm` : "身長不明"}  
                        {cast.job && ` ${cast.job}`}
                    </Typography>
                </div>

                {/* 自己紹介（フェードアウト適用） */}
                {cast.self_introduction && (
                    <div
                        ref={introRef}
                        className="overflow-hidden whitespace-nowrap"
                        style={
                            isIntroOverflow
                                ? {
                                    maskImage: "linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 98%)",
                                    WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 98%)",
                                }
                                : {}
                        }
                    >
                        <Typography variant="body2" className="text-gray-600 mt-3 border-t pt-2">
                            {cast.self_introduction}
                        </Typography>
                    </div>
                )}

                {/* ステータス（受付中 / 今すぐOK） */}
                {cast.available_at ? (
                    <Typography variant="body2" className="text-green-500 mt-2">🟢 今すぐOK</Typography>
                ) : (
                    <Typography variant="body2" className="text-gray-500 mt-2">受付中</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default CastCard;
