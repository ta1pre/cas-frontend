import React from "react";
import { Box } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";

interface ProfileImagesProps {
    images: { url: string; order_index: number }[];
    fullWidth?: boolean;
}

export default function ProfileImages({ images, fullWidth = false }: ProfileImagesProps) {
    return (
        <Box className={fullWidth ? "w-full h-[75vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden" : "p-4"}> {/* ✅ 画像のサイズを縦長(3:4)に調整 */}
            <Swiper
                modules={[Navigation, Pagination, Zoom]}
                navigation
                pagination={{ clickable: true }}
                zoom={true}
                spaceBetween={10}
                slidesPerView={1}
                className="w-full h-full"
                style={{ 
                    ["--swiper-navigation-color" as any]: "rgba(255,255,255,0.8)", 
                    ["--swiper-pagination-color" as any]: "rgba(255,255,255,0.8)" 
    }}
            >
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image.url} className="w-full h-full object-cover cursor-pointer" />
                        </SwiperSlide>
                    ))
                ) : (
                    <SwiperSlide>
                        <img src="/default-avatar.png" className="w-full h-full object-cover" />
                    </SwiperSlide>
                )}
            </Swiper>
        </Box>
    );
}
