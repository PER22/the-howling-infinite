// users-service.js
import * as usersAPI from './users-api';

export async function signUp(userData){
    const response = await usersAPI.signUp(userData);
    return response;
}

export async function verify(token) {
    const response = await usersAPI.verify(token);
    console.log("Recieved response from verify: ", response);
    if (response) {
        console.log(response);
        localStorage.setItem('token',token);
        return getLoggedInUser();
    } else {
        throw new Error(response.error || 'Email verification failed');
    }
}

export function getToken() {
    // getItem returns null if there's no string
    console.log("users-service: entering getToken()");
    const token = localStorage.getItem('token');
    console.log("users-service: got this from localStorage: ", token);
    if (!token){ 
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
    console.log("Getting logged in user");
    const token = getToken();
    console.log("token: ", token);
    // If there's a token, return the user in the payload, otherwise return null
    return token ? JSON.parse(atob(token.split('.')[1])).user : null;
}

export function logOut() {
    localStorage.removeItem('token');
}

export async function login(credentials) {
    const token = await usersAPI.login(credentials);
    localStorage.setItem('token', token)
    return getLoggedInUser();
}
