import { GET_USER_LIST_URL, USER_LOGIN_URL } from "@/shared/constants/urls";
import { toast } from "react-toastify";

export async function getAllUsers() {
    try {
        const response = await fetch(GET_USER_LIST_URL);

        if (!response.ok) {
            toast.error('Failed to fetch users');
            return [];
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            toast.error('No users found');
            return [];
        }

        return data;
    } catch (err) {
        toast.error('An error occured: ' + err);
    }
}

export async function login(userForm) {
    const { email, password } = userForm || {};

    if (!email || !password) {
        toast.error('Error in receiving the user values');
        return;
    }

    try {
        const response = await fetch(USER_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            })
        });



        if (!response.ok) {
            toast.error('Failed to fetch user');
            return null;
        }

        const user = await response.json();
        saveUser(user);
        return user;
    } catch (err) {
        toast.error('An error occured: ' + err.message);
        return null;
    }
}

export async function signup(userForm) {
    const { name, email, password, confirmPassword } = userForm || {};

    if (!email || !password || !name || !confirmPassword) {
        toast.error('Error in receiving the user values');
        return;
    }

    if (password !== confirmPassword) {
        toast.error('Password and Confirm Password should be same');
        return;
    }

    try {
        const response = await fetch(USER_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        if (!response.ok) {
            toast.error('Failed to fetch user');
            return null;
        }

        const user = await response.json();
        saveUser(user);
        return user;
    } catch (err) {
        toast.error('An error occured: ' + err.message);
        return null;
    }
}

export function logout() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('user');
  } catch (err) {
    console.error('Error removing user from localStorage:', err);
  }
}

export function saveUser(user) {
    if (!user || typeof window === 'undefined') return;

    try {
        localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
        console.error('Error saving user to localStorage:', err);
    }
}

export function getUser() {
  if (typeof window === 'undefined') return null;

  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error('Error reading user from localStorage:', err);
    return null;
  }
}
