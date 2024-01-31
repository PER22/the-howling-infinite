// /src/utilities/comments-api.js:
import sendRequest from './send-request';
const BASE_URL = '/api/contact';

export function postMessage(message){
    return sendRequest(BASE_URL, 'POST', message);
}
