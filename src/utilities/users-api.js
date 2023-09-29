//users-api.js:
import sendRequest from "./send-request";
const BASE_URL = '/api/users';


export function signUp(userData) {
    return sendRequest(BASE_URL, 'POST', userData);
  }

export function verify(token){
  return sendRequest(`${BASE_URL}/verify-email`, 'POST',  {token} );
}

export function login(credentials) {
    return sendRequest(`${BASE_URL}/login`, 'POST', credentials);
}
