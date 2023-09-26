import sendRequest from "./send-request";

const BASE_URL = '/api/blog';

export async function getAllPosts() {
  return sendRequest(BASE_URL);
}

export async function createPost(postData) {
  return sendRequest(BASE_URL, 'POST', postData);
}

export async function getPostById(postId) {
  return sendRequest(`${BASE_URL}/${postId}`);
}

export async function updatePost(postId, postData) {
  return sendRequest(`${BASE_URL}/${postId}`, 'PUT', postData);
}

export async function deletePost(postId) {
  return sendRequest(`${BASE_URL}/${postId}`, 'DELETE');
}

export async function starPost(postId) {
  return sendRequest(`${BASE_URL}/${postId}/star`, "POST");
}

export async function unstarPost(postId) {
  return sendRequest(`${BASE_URL}/${postId}/star`, "DELETE");
}
