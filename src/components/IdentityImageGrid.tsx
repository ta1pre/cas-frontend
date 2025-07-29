"use client";
import Image from "next/image";
import { ImageList, ImageListItem, ImageListItemBar, Dialog, Typography, Box, IconButton } from "@mui/material";
import { Close as CloseIcon, Fullscreen as FullscreenIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { useState } from "react";
import { IdentityDoc } from "@/api/admin/identity";

interface Props {
  docs: IdentityDoc[];
}

export default function IdentityImageGrid({ docs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ImageList cols={3} gap={16} sx={{ overflowY: "visible" }}>
        {docs.map((doc, idx) => (
          <ImageListItem
            key={doc.id}
            sx={{
              position: "relative",
              cursor: "pointer",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "& .hover-overlay": {
                  opacity: 1,
                }
              }
            }}
            onClick={() => setOpenIndex(idx)}
          >
            <Image
              src={doc.url}
              unoptimized
              alt="identity"
              width={500}
              height={350}
              className="object-cover w-full h-[220px]"
            />
            
            {/* ホバー時のオーバーレイ */}
            <Box
              className="hover-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s ease",
              }}
            >
              <FullscreenIcon sx={{ color: "white", fontSize: 40 }} />
            </Box>
            
            <ImageListItemBar
              title={format(new Date(doc.created_at), "yyyy/MM/dd HH:mm")}
              position="below"
              sx={{
                "& .MuiImageListItemBar-title": {
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* 拡大表示ダイアログ */}
      {openIndex !== null && (
        <Dialog 
          open 
          onClose={() => setOpenIndex(null)} 
          maxWidth="lg"
          sx={{
            "& .MuiDialog-paper": {
              position: "relative",
              backgroundColor: "black",
              margin: 0,
              maxHeight: "95vh",
              maxWidth: "95vw",
            }
          }}
        >
          <IconButton
            onClick={() => setOpenIndex(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255,255,255,0.8)",
              zIndex: 1,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Box sx={{ textAlign: "center", p: 2 }}>
            <img
              src={docs[openIndex].url}
              alt="拡大表示"
              style={{
                maxHeight: "80vh",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: "white", 
                mt: 1,
                textAlign: "center"
              }}
            >
              アップロード日時: {format(new Date(docs[openIndex].created_at), "yyyy年MM月dd日 HH:mm")}
            </Typography>
          </Box>
        </Dialog>
      )}
    </>
  );
}
