import * as imageAPI from './images-api'

export function uploadInlineImage(formData){
    return imageAPI.uploadInlineImage(formData);
}

export async function getSignedURLForImage(s3Key){
        try{
            const signedURL = await imageAPI.getSignedURLForImage(s3Key);
            if(!signedURL.error) {
                return {data: signedURL, error: null};
            }
            return {data : null, error: "Failed to get image URL."};
        }catch(err){
            console.log("Failed to get image URL:", err);
            return {data: null, error: "Failed to get image URL."};
        }
}