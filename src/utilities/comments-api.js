// /src/utilities/comments-api.js:
import sendRequest from './send-request';
const BASE_URL = '/api/comments';

export function postComment(comment){
    return sendRequest(BASE_URL, 'POST', comment)
}

export function getCommentsOn(contentType, contentId){
    return sendRequest(`${BASE_URL}/on/${contentType}/${contentId}`);
}
