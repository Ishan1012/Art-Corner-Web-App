import { NEWSLETTERS_URL } from "@/shared/constants/urls";
import { toast } from "react-toastify";

export default async function getAllNewsletters() {
  try {
    const response = await fetch(NEWSLETTERS_URL);

    if(!response.ok) {
      toast.error('Failed to fetch communities');
      return [];
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      toast.error("No community found");
      return [];
    }

    return data;
  } catch (err) {
    toast.error('An error occured: ' + err);
    return [];
  }
}