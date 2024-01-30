// /src/utilities/comments-service.js:
import * as commentAPI from './comments-api'


export async function getComments() {
    try {
        const comments = await commentAPI.getComments();
        if (!comments.error) {
            return { data: comments, error: null };
        }
        return { data: null, error: comments.error };
    } catch (err) {
        console.log(`Failed to get comments :`, err);
        return { data: null, error: `Failed to get comments:` };
    }
}


export async function postComment(comment) {
    try {
        const newComment = await commentAPI.postComment(comment);
        return (newComment && !newComment.error) ?
            { data: newComment, error: null }
            :
            { data: null, error: newComment.error };
    } catch (err) {
        return { data: null, error: `Failed to post comment: ${err.message}` };
    }
}

export async function editCommentById(commentId, newText) {
    try {
        const editedComment = await commentAPI.editCommentById(commentId, newText);
        if (editedComment && !editedComment.error) {
            return { data: editedComment, message: "Comment edit successfully" };
        }
        else { return { error: editedComment.error } }
    } catch (err) { }
}

export async function getCommentsAwaitingApproval() {
    try {
        const comments = await commentAPI.getCommentsAwaitingApproval();
        if (!comments.error) {
            return { data: comments, error: null };
        }
        return { data: null, error: comments.error };
    } catch (err) {
        console.log(`Failed to get comments waiting approval`, err);
        return { data: null, error: `Failed to get comments awaiting approval` };
    }
}

export async function approveCommentById(commentId) {
    try {
        const approvedComment = await commentAPI.approveCommentById(commentId);
        if (!approvedComment.error) {
            return { data: approvedComment, error: null };
        }
        return { data: null, error: approvedComment.error };
    } catch (err) {
        console.log(`Failed to approve comment`, err);
        return { data: null, error: `Failed to approve comment` };
    }
}

export async function deleteCommentById(commentId) {
    try {
        const deletedComment = await commentAPI.deleteCommentById(commentId);
        if (!deletedComment.error) {
            return { data: deletedComment, error: null };
        }
        return { data: null, error: deletedComment.error };
    } catch (err) {
        console.log(`Failed to delete comment`, err);
        return { data: null, error: `Failed to delete comment` };
    }
}