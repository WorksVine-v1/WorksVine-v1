import { useState } from "react";
import { CLOUDINARY_CONFIG } from "../lib/cloudinary";
import type { Document } from "../types";

export function useUpload() {
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file: File): Promise<Document | null> => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
                { method: "POST", body: formData }
            );

            const data = await res.json();

            if (!data.secure_url) return null;

            const doc: Document = {
                id: data.public_id,
                name: file.name,
                url: data.secure_url,
                type: file.type.includes("pdf") ? "pdf" : "image",
            };

            return doc;
        } catch (e) {
            console.error("Upload error:", e);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading };
}