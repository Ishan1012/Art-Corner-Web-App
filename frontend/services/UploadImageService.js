import { POST_ARTIFACTS } from "@/shared/constants/urls";

export default async function UploadImageService(file, formData) {
    if (!file) {
        throw new Error("No file provided");
    }

    formData = new FormData({
        image: file
    });

    try {
        const response = await fetch(POST_ARTIFACTS, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}
