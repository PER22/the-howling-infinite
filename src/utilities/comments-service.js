// /src/utilities/comments-service.js:
import * as commentAPI from './comments-api'


export async function getCommentsOn(contentType, contentId){
    try{
        const comments = await commentAPI.getCommentsOn(contentType, contentId);
        if(!comments.error) {
            return {data: comments, error: null};
        }
        return {data : null, error: comments.error};
    }catch(err){
        console.log(`Failed to comments on ${contentType}: ${contentId} :`, err);
        return {data: null, error: `Failed to comments on ${contentType}: ${contentId} :`};
    }
}

export async function postComment(contentType, contentId){
    try{
        const newComment = await commentAPI.postComment(contentType, contentId);
        if(!newComment.error) {
            return {data: newComment, error: null};
        }
        return {data : null, error: newComment.error};
    }catch(err){
        console.log(`Failed to post comment on ${contentType}: ${contentId} :`, err);
        return {data: null, error: `Failed to post comment on ${contentType}: ${contentId} :`};
    }
}

export async function getCommentsAwaitingApproval(){
    try{
        const comments = await commentAPI.getCommentsAwaitingApproval();
        if(!comments.error) {
            return {data: comments, error: null};
        }
        return {data : null, error: comments.error};
    }catch(err){
        console.log(`Failed to get comments waiting approval`, err);
        return {data: null, error: `Failed to get comments awaiting approval`};
    }
}

export async function approveCommentById(commentId){
    try{
        const approvedComment = await commentAPI.approveCommentById(commentId);
        if(!approvedComment.error) {
            return {data: approvedComment, error: null};
        }
        return {data : null, error: approvedComment.error};
    }catch(err){
        console.log(`Failed to approve comment`, err);
        return {data: null, error: `Failed to approve comment`};
    }
}

export async function deleteCommentById(commentId){
    try{
        const deletedComment = await commentAPI.deleteCommentById(commentId);
        if(!deletedComment.error) {
            return {data: deletedComment, error: null};
        }
        return {data : null, error: deletedComment.error};
    }catch(err){
        console.log(`Failed to delete comment`, err);
        return {data: null, error: `Failed to delete comment`};
    }
}