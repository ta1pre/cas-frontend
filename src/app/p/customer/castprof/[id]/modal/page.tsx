"use client";

import React from "react";
import { Box } from "@mui/material";

export default function CastProfilePage() {
    return (
        <Box 
            className="w-full h-screen bg-green-500 flex justify-center items-center overflow-hidden"
        >
            <img 
                src="https://60c151628549.ngrok.app/images/dummy_img/001.jpg" 
                alt="Profile Background" 
                className="w-full h-full object-cover"
            />
        </Box>
    );
}