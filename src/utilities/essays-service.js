// /src/utilities/essays-service.js:
import * as essayAPI from './essays-api'

export async function createEssay(){
    try{
        const newEssay = await essayAPI.createEssay();
        if(!newEssay.error) {
            return {data: newEssay, error: null};
        }
        return {data : null, error: "Failed to create essay."};
    }catch(err){
        console.log("Failed to create essay:", err);
        return {data: null, error: "Failed to create essay."};
    }
}

export async function getMainEssayPreview(){
    try{
        const preview = await essayAPI.getMainEssayPreview();
        if(!preview.error){
            return {data: preview, error: null};
        }
    }catch(err){
        console.log("Failed to retrieve main essay preview:", err);
        return {data: null, error: "Failed to retrieve main essay preview."};
    }

}

export async function getSideEssayPreviews(){
    try{
        const previews = await essayAPI.getSideEssayPreviews();
        if(!previews.error) {
            return {data: previews, error: null};
        }
        return {data : null, error: "Failed to retrieve side essay previews."};
    }catch(err){
        console.log("Failed to retrieve side essay previews:", err);
        return {data: null, error: "Failed to retrieve side essay previews."};
    }
}

export async function getMainEssay(){
    try{
        const mainEssay = await essayAPI.getMainEssay();
        if(!mainEssay.error) {
            return {data: mainEssay, error: null};
        }
        return {data : null, error: "Failed to retrieve main essay."};
    }catch(err){
        console.log("Failed to retrieve main essay:", err);
        return {data: null, error: "Failed to retrieve main essay."};
    }
}

export async function updateMainEssay(formData){
    try{
        const updatedEssay = await essayAPI.updateMainEssay(formData);
        if(!updatedEssay.error) {
            return {data: updatedEssay, error: null};
        }
        return {data : null, error: "Failed to update main essay."};
    }catch(err){
        console.log("Failed to update main essay:", err);
        return {data: null, error: "Failed to update main essay."};
    }
}