"use client";

import React from "react";
import { Box } from "@mui/material";

export default function CastProfilePage() {
    return (
        <Box 
            className="w-full h-screen bg-green-500 flex justify-center items-center overflow-hidden"
        >
            <img 
                src="https://8c0b37dc5a6a.ngrok.app/images/dummy_img/001.jpg" 
                alt="Profile Background" 
                className="w-full h-full object-cover"
            />
        </Box>
    );
}