// /src/utilities/essays-service.js:
import * as essayAPI from './essays-api'

export async function createEssay(formData){
    try{
        const newEssay = await essayAPI.createEssay(formData);
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

export async function getSideEssay(essayId){
    try{
        const essay = await essayAPI.getSideEssay(essayId);
        if(!essay.error) {
            return {data: essay, error: null, message: null};
        }
        return {data : null, error: "Failed to retrieve requested essay."};
    }catch(err){
        console.log("Failed to retrieve requested essay:", err);
        return {data: null, error: "Failed to retrieve requested essay."};
    }
}

export async function updateSideEssay(essayId, formData){
    try{
        const essay = await essayAPI.updateSideEssay(essayId, formData);
        if(!essay.error) {
            return {data: essay, error: null, message: null};
        }
        return {data : null, error: "Failed to update requested essay."};
    }catch(err){
        console.log("Failed to update requested essay:", err);
        return {data: null, error: "Failed to update requested essay."};
    }
}

export async function deleteEssay(essayId){
    try{
        const deletedEssay = await essayAPI.deleteEssay(essayId);
        if(!deletedEssay.error) {
            return {message: deletedEssay.message};
        }
        return {data : null, error: deletedEssay.error};
    }catch(err){
        console.log("Failed to delete requested essay:", err);
        return {data: null, error: "Failed to delete requested essay."};
    }
}


export async function starEssayById(essayId){
    try{
        const response = await essayAPI.starEssayById(essayId);
        if(!response.error) {
            return {data: response.data, error: null};
        }
        return {data : null, error: response.error};
    }catch(err){
        console.log("Failed to star requested essay:", err);
        return {data: null, error: "Failed to star requested essay."};
    }
}

export async function unstarEssayById(essayId){
    try{
        const unstarredEssay = await essayAPI.unstarEssayById(essayId);
        if(!unstarredEssay.error) {
            return {data: unstarredEssay.data};
        }
        return {data : null, error: unstarredEssay.error};
    }catch(err){
        console.log("Failed to unstar requested essay:", err);
        return {data: null, error: "Failed to unstar requested essay."};
    }
}