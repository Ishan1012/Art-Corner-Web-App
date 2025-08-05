import { GENERATE_IMAGE_URL } from '@/shared/constants/urls'
import { toast } from 'react-toastify';

export default async function generateImage(userid, prompt) {
    if (!userid || !prompt) {
        console.log("error in getting values of userid and prompt");
        return null;
    }
    try {
        const response = await fetch(GENERATE_IMAGE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid, prompt })
        });;

        if (!response.ok) {
            toast.error('Failed to generate image'+ response);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error in generating the image:", err);
        toast.error('Something went wrong');
        return null;
    }
}
