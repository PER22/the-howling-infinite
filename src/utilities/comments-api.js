// /src/utilities/comments-api.js:
import sendRequest from './send-request';
const BASE_URL = '/api/comments';

export function postComment(comment){
    return sendRequest(BASE_URL, 'POST', comment)
}

export function editCommentById(commentId, newText){
    return sendRequest(`${BASE_URL}/${commentId}`, 'PUT', newText);
}

export function getComments(){
    return sendRequest(`${BASE_URL}`);
}

export function getCommentsAwaitingApproval(){
    return sendRequest(`${BASE_URL}/moderate`);
}

export function approveCommentById(commentId){
    return sendRequest(`${BASE_URL}/moderate/${commentId}`, "POST");
}

export function deleteCommentById(commentId){
    return sendRequest(`${BASE_URL}/${commentId}`, "DELETE");
}