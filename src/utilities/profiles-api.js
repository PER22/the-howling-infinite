import sendRequest from "./send-request";
const BASE_URL = '/api/profile';

export async function getAllProfilesRequest(){
    return sendRequest(`${BASE_URL}`) 
}

export async function getProfileByIdRequest(profileId){
  return sendRequest(`${BASE_URL}/${profileId}`) 
}

export async function updateProfileRequest(profileId, profileData) {
    return sendRequest(`${BASE_URL}/${profileId}`, 'PUT', profileData);
}
  
export async function deleteProfileRequest(profileId) {
    return sendRequest(`${BASE_URL}/${profileId}`, 'DELETE');
}