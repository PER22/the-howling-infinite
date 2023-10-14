//users-api.js:
import sendRequest from "./send-request";
const BASE_URL = '/api/users';


export function signUp(userData) {
  return sendRequest(BASE_URL, 'POST', userData);
}

export function verifyEmail(token) {
  return sendRequest(`${BASE_URL}/verify-email`, 'POST', { token });
}

export function login(credentials) {
  return sendRequest(`${BASE_URL}/login`, 'POST', credentials);
}

export function resetPassword(token, password) {
  return sendRequest(`${BASE_URL}/perform-password-reset`, "PUT", { token: token, newPassword: password });
}

export function requestPasswordReset(email){
  return sendRequest(`${BASE_URL}/request-password-reset`, 'POST', {email});
}
