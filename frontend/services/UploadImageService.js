import { POST_ARTIFACTS } from "@/shared/constants/urls";
import { toast } from "react-toastify";

export default async function UploadImageService(formData) {
  const { title, desc, img, contentType, tags } = formData;

  try {
    const response = await fetch(POST_ARTIFACTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        desc,
        img,
        contentType,
        tags,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      toast.error(`Upload failed: ${data.message}`);
      return;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}
