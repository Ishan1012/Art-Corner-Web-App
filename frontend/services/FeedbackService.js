import { POST_FEEDBACK } from "@/shared/constants/urls";
import { toast } from "react-toastify";

export default async function sendFeedback(feedbackForm) {
  const { name, email, subject, description } = feedbackForm;

  if (!name || !email || !subject) {
    return { success: false, reason: 'Error in receiving the community values' };
  }

  try {
    const response = await fetch(POST_FEEDBACK, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        ...(description && { description })
      }),
    })

    if (!response.ok) {
      return { success: false, reason: 'Failed to post feedback '+response.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, reason: 'An error occured: ' + err.message };
  }
}
