import { toast } from "react-toastify";
import { ARTIFACTS_BY_ID_URL, ARTIFACTS_BY_SEARCH_URL, ARTIFACTS_URL } from "@/shared/constants/urls";

export default async function getAll() {
  try {
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

    // Convert buffer images to base64
    const convertedData = data.map((artifact) => {
      if (typeof artifact.img === 'string' && artifact.img.includes('/img/img')) {
        // Image is already a valid path, no changes needed
        return artifact;
      } else {
        const base64Image = `data:${artifact.contentType};base64,${artifact.img.toString('base64')}`;
        console.log(base64Image);
        return {
          ...artifact,
          img: base64Image,
        };
      }
    });

    return convertedData;
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    toast.error('An unexpected error occurred');
    return [];
  }
}


export async function getArtifactById(id) {
  try {
    const response = await fetch(`${ARTIFACTS_BY_ID_URL}${id}`);

    if (!response.ok) {
      toast.error('Failed to fetch artifact');
      return null;
    }

    const artifact = await response.json();
    if (typeof artifact.img === 'string' && artifact.img.includes('/img/img')) {
      // Image is already a valid path, no changes needed
      return artifact;
    } else {
      const base64Image = `data:${artifact.contentType};base64,${artifact.img.toString('base64')}`;
      console.log(base64Image);
      return {
        ...artifact,
        img: base64Image,
      };
    }
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
  const convertedData = data.map((artifact) => {
    if (typeof artifact.img === 'string' && artifact.img.includes('/img/img')) {
      // Image is already a valid path, no changes needed
      return artifact;
    } else {
      const base64Image = `data:${artifact.contentType};base64,${artifact.img.toString('base64')}`;
      return {
        ...artifact,
        img: base64Image,
      };
    }
  });

  return convertedData;
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
