// src/utilities/essays-api.js:
import sendRequest from "./send-request";

const BASE_URL = "/api/essays"

export function createEssay(formData){
    return sendRequest(BASE_URL, 'POST', formData);
}

export function getMainEssayPreview(){
    return sendRequest(`${BASE_URL}/mainEssayPreview`);
}

export function getSideEssayPreviews(){
    return sendRequest(`${BASE_URL}/sideEssayPreviews`);
}

export function getMainEssay(){
    return sendRequest(`${BASE_URL}`);
}

export function updateMainEssay(formData){
    return sendRequest(`${BASE_URL}`, 'PUT', formData);
}

export function getSideEssay(essayId){
    return sendRequest(`${BASE_URL}/${essayId}`);
}

export function updateSideEssay(essayId, formData){
    return sendRequest(`${BASE_URL}/${essayId}`, "PUT", formData);
}

export function deleteEssay(essayId){
    return sendRequest(`${BASE_URL}/${essayId}`, "DELETE");
}

export function starEssayById(essayId){
    return sendRequest(`${BASE_URL}/star/${essayId}`, "POST");
}

export function unstarEssayById(essayId){
    return sendRequest(`${BASE_URL}/star/${essayId}`, "DELETE");
}

