import { jwtDecode } from "jwt-decode";

console.log(jwtDecode); // Log the structure to the console
// Function to get role from token
export const getUserRole = () => {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded); // Log the decoded payload
        return decoded.role; // Ensure the role claim is present in your token
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};