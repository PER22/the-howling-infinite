import sendRequest from "./send-request"
const BASE_URL = "/api/images"

export function uploadInlineImage(formData){
    return sendRequest(`${BASE_URL}/upload`, "POST", formData)
}

export function getSignedURLForImage(s3Key){
    return fetch(`/api/images/${s3Key}`);
}