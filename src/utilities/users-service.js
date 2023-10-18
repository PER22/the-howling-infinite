// users-service.js
import * as usersAPI from './users-api';

export async function signUp(userData) {
    const response = await usersAPI.signUp(userData);
    return response;
}

export async function verifyEmail(token) {
    const response = await usersAPI.verifyEmail(token);
    if (response) {
        return;
    } else {
        throw new Error(response.error || 'Email verification failed');
    }
}

export function getToken() {
    // getItem returns null if there's no string
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    // Obtain the payload of the token
    const payload = JSON.parse(atob(token.split('.')[1]));
    // A JWT's exp is expressed in seconds, not milliseconds, so convert
    if (payload.exp < Date.now() / 1000) {
        // Token has expired - remove it from localStorage
        localStorage.removeItem('token');
        return null;
    }
    return token;
}

export function getLoggedInUser() {
    const token = getToken();
    return token ? JSON.parse(atob(token.split('.')[1])).user : null;
}

export function logOut() {
    localStorage.removeItem('token');
}

export async function login(credentials) {
    const token = await usersAPI.login(credentials);
    console.log(token);
    if (!token.error) {
        localStorage.setItem('token', token)
        return getLoggedInUser();
    }
    else{
        return {error: token.error};
    }
}
