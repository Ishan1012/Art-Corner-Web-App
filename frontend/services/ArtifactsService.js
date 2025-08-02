import { toast } from "react-toastify";
import { ARTIFACTS_BY_ID_URL, ARTIFACTS_BY_SEARCH_URL, ARTIFACTS_URL } from "@/shared/constants/urls";

export default async function getAll() {
  const response = await fetch(ARTIFACTS_URL);
  if (!response.ok) {
    toast.error('Failed to fetch artifacts');
    return [];
  }
  const data = await response.json();
  if (!data || data.length === 0) {
    toast.error('No artifacts found');
    return [];
  }
  return data;
}

export async function getArtifactById(id) {
  try {
    const response = await fetch(`${ARTIFACTS_BY_ID_URL}${id}`);
    console.log(`Fetching: ${ARTIFACTS_BY_ID_URL}${id}`);

    if (!response.ok) {
      toast.error('Failed to fetch artifact');
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artifact by ID:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
}

export function setArtifacts(artifactsList) {
  return artifactsList;
}

export async function searchArtifacts(query) {
  const response = await fetch(ARTIFACTS_BY_SEARCH_URL + query);
  if (!response.ok) {
    toast.error('Failed to fetch artifact');
  }
  const data = await response.json();
  if (!data || data.length === 0) {
    toast.error('No artifacts found');
    return [];
  }
  return data;
}

export async function addLike(itemId, user) {
  if (!user || !user.id) {
    console.log("Not signed in");
    return;
  }

  try {
    const response = await fetch(`${ARTIFACTS_BY_ID_URL + itemId}/like`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (!response.ok) {
      toast.error('Failed to like artifact');
      return null;
    }

    const updatedItem = await response.json();
    return updatedItem;
  } catch (err) {
    console.error("Error liking artifact:", err);
    toast.error('Something went wrong');
    return null;
  }
}

export async function removeLike(itemId, userId) {
  if (!itemId || !userId) {
    console.warn("Missing itemId or userId");
    return;
  }

  try {
    const response = await fetch(`${ARTIFACTS_BY_ID_URL + itemId}/unlike`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      toast.error('Failed to remove like');
      return null;
    }

    const updatedItem = await response.json();
    return updatedItem;
  } catch (error) {
    console.error("Error removing like:", error);
    toast.error("Something went wrong");
    return null;
  }
}
