import { toast } from "react-toastify";

export default async function getAll() {
  const response = await fetch('http://localhost:5000/api/artifacts/');
  if (!response.ok) {
    toast.error('Failed to fetch artifacts');
  }
  const data = await response.json();
  if (!data || data.length === 0) {
    toast.error('No artifacts found');
    return [];
  }
  return data;
}

export async function getArtifactById(id) {
  const response = await fetch(`http://localhost:5000/api/artifacts/${id}`);
  if (!response.ok) {
    toast.error('Failed to fetch artifact');
    return null;
  }
  const data = await response.json();
  return data;
}

export function setArtifacts(artifactsList) {
  return artifactsList;
}

export async function searchArtifacts(query) {
  const response = await fetch(`http://localhost:5000/api/artifacts/search/${query}`);
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
  if (!user || !user._id) {
    console.log("Not signed in");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/artifacts/${itemId}/like`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user._id }),
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
    const response = await fetch(`http://localhost:5000/api/artifacts/${itemId}/unlike`, {
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
