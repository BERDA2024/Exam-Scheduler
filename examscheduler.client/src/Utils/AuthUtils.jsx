export const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.log("Token not found!");
        return null;
    }
    return { Authorization: `Bearer ${token}` };
};