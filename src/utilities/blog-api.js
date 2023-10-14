// /src/utilties/blog-api.js:
import sendRequest from "./send-request";

const BASE_URL = '/api/blog'

export function getBlogPostPreviews(){
    return sendRequest(`${BASE_URL}`);
}

export function createBlogPost(formData){
    return sendRequest(`${BASE_URL}`, "POST", formData);
}

export function editBlogPost(postId, formData){
    return sendRequest(`${BASE_URL}/${postId}`, "PUT", formData);
}

export function getBlogPostById(postId){
    return sendRequest(`${BASE_URL}/${postId}`);
}

export function starPostById(postId){
    return sendRequest(`${BASE_URL}/star/${postId}`, "POST");
}

export function unstarPostById(postId){
    return sendRequest(`${BASE_URL}/star/${postId}`, "DELETE");
}