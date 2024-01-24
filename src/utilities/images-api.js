import sendRequest from "./send-request"
const BASE_URL = "/api/images"

export function uploadInlineImage(formData){
    return sendRequest(`${BASE_URL}/upload`, "POST", formData);
}

export async function getSignedURLForImage(s3Key){
    
    let signedURL = await sendRequest(`${BASE_URL}/${s3Key}`);
    return signedURL;
}