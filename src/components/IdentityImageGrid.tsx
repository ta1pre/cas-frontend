"use client";
import Image from "next/image";
import { ImageList, ImageListItem, ImageListItemBar, Dialog } from "@mui/material";
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
            className="cursor-pointer hover:opacity-90"
            onClick={() => setOpenIndex(idx)}
          >
            <Image
              src={doc.url}
              unoptimized
              alt="identity"
              width={500}
              height={350}
              className="rounded-lg object-cover w-full h-[220px]"
            />
            <ImageListItemBar
              title={format(new Date(doc.created_at), "yyyy/MM/dd HH:mm")}
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>

      {openIndex !== null && (
        <Dialog open onClose={() => setOpenIndex(null)} maxWidth="lg">
          <img
            src={docs[openIndex].url}
            className="max-h-[80vh] w-auto object-contain"
          />
        </Dialog>
      )}
    </>
  );
}
