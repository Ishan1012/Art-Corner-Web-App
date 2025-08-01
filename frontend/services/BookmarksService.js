const STORAGE_KEY = 'bookmarks';

function getStoredBookmarks() {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveBookmarks(bookmarks) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function getAllBookmarks() {
    return getStoredBookmarks();
}

export function addBookmark(bookmark) {
    const bookmarks = getStoredBookmarks();
    bookmarks.push(bookmark);
    saveBookmarks(bookmarks);
    return true;
}

export function removeBookmark(bookmarkId) {
    const bookmarks = getStoredBookmarks();
    const filtered = bookmarks.filter(b => b._id !== bookmarkId);
    saveBookmarks(filtered);
    return true;
}
