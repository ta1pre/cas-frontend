import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Cast } from "../../api/cast/castTypes";
import CastProfileModal from "../../../castprof/[id]/modal/CastProfileModal";

interface CastCardProps {
    cast: Cast;
}

const CastCard: React.FC<CastCardProps> = ({ cast }) => {
    const imageUrl = cast.profile_image_url || "/default-avatar.png";
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        <>
            <Card 
                className="w-full sm:w-full md:w-5/6 lg:w-3/4 mx-auto shadow-md border border-gray-200 cursor-pointer"
                onClick={() => setIsModalOpen(true)} // カード全体をクリック可能に
            >
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-lg">
                    <img 
                        src={imageUrl} 
                        alt={cast.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                    />
                    {/* 赤丸マークを画像の上に表示 */}
                    {cast.available_at && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full shadow-md border border-white"></div>
                    )}
                </div>

                <CardContent className="p-2 sm:p-4 text-left">
                    <Typography variant="h6" className="font-bold">{cast.name || "名前未設定"}</Typography>
                    
                    {/* 料金表示を追加 */}
                    {cast.reservation_fee !== undefined && (
                        <Typography 
                            variant="body2" 
                            className="text-pink-600 font-bold mb-1"
                        >
                            {(cast.reservation_fee * 2).toLocaleString()}P~/60分
                        </Typography>
                    )}
                    
                    {/* 年齢 / 身長 / 職業（フェードアウト適用） */}
                    <div
                        ref={jobRef}
                        className="overflow-hidden whitespace-nowrap border-b pb-1"
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
                    <div className="border-t pt-2">
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
                                <Typography variant="body2" className="text-gray-600">
                                    {cast.self_introduction}
                                </Typography>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* モーダル */}
            <CastProfileModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                castId={cast.cast_id} 
                source="検索結果" 
            />
        </>
    );
};

export default CastCard;
