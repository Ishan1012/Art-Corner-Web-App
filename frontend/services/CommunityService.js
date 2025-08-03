import { COMMUNITY_BY_ID_URL, COMMUNITY_URL, POST_COMMUNITY } from '@/shared/constants/urls'
import { toast } from 'react-toastify';

export default async function getAll() {
  try {
    const response = await fetch(COMMUNITY_URL);

    if (!response.ok) {
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

export async function getCommunity(communityId) {
  try {
    const response = await fetch(COMMUNITY_BY_ID_URL + communityId);
    console.log(COMMUNITY_BY_ID_URL + communityId);

    if (!response.ok) {
      toast.error('Failed to fetch community');
      return null;
    }

    const community = await response.json();
    return community;
  } catch (err) {
    toast.error('An error occured: ' + err.message);
    return null;
  }
}

export async function postCommunity(communityForm) {
  const { name, members, description, img } = communityForm;

  if (!name || !description) {
    toast.error('Error in receiving the community values');
    return;
  }

  try {
    const response = await fetch(POST_COMMUNITY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        ...(members && { members }),
        description,
        ...(img && { img })
      })
    })

    if (!response.ok) {
      toast.error('Failed to fetch community');
      return null;
    }

    const community = await response.json();
    return community;
  } catch (err) {
    toast.error('An error occured: ' + err.message);
    return null;
  }
}

export async function joinCommunity(communityId, user) {
  if (!user) {
    toast.error("User not found, please login");
    return { success: false, reason: 'no-user' };
  }

  const userId = user._id;

  try {
    const res = await fetch(`${COMMUNITY_BY_ID_URL + communityId}/join`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ member: userId })
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, alreadyJoined: false, data };
    } else if (res.status === 403) {
      return { success: false, alreadyJoined: true };
    } else {
      console.error(data.message || "Failed to join community.");
      return { success: false, reason: data.message };
    }
  } catch (err) {
    toast.error("Join failed: " + err.message);
    return { success: false, reason: 'network-error', error: err };
  }
}

export async function leaveCommunity(communityId, user) {
  if (!user) {
    toast.error("User not found, please login");
    return { success: false, reason: 'no-user' };
  }

  const userId = user._id;

  try {
    const res = await fetch(`${COMMUNITY_BY_ID_URL + communityId}/leave`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ member: userId })
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, data };
    } else {
      console.error(data.message || "Failed to join community.");
      return { success: false, reason: data.message };
    }
  } catch (err) {
    toast.error("Join failed: " + err.message);
    return { success: false, reason: 'network-error', error: err };
  }
}
