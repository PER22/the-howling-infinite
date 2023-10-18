// src/utilities/blog-service.js:
import * as blogAPI from './blog-api';

export async function getBlogPostPreviews(){
    try{
        const posts = await blogAPI.getBlogPostPreviews();
        if(!posts.error) {
            return {data: posts, error: null};
        }
        return {data : null, error: "Failed to retrieve blog posts."};
    }catch(err){
        console.log("Error retrieving all blog posts: ", err);
        return {data: null, error: "Error retrieving all blog posts."};
    }
}

export async function createBlogPost(formData){
    try{
        const newPost = await blogAPI.createBlogPost(formData);
        if(!newPost.error) {
            return {data: newPost, error: null};
        }
        return {data : null, error: newPost.error};
    }catch(err){
        console.log(err);
        return {data: null, error: err};
    }
}

export async function editBlogPost(postId, formData){
    try{
        const updatedPost = await blogAPI.editBlogPost(postId, formData);
        if(!updatedPost.error) {
            return {data: updatedPost, error: null};
        }
        return {data : null, error: "Failed to update blog post."};
    }catch(err){
        console.log("Error getting blog post: ", err);
        return {data: null, error: "Failed update blog post."};
    }
}

export async function getBlogPostById(postId){
    try{
        const requestedPost = await blogAPI.getBlogPostById(postId);
        if(!requestedPost.error) {
            return {data: requestedPost, error: null};
        }
        return {data : null, error: "Failed to get requested blog post."};
    }catch(err){
        console.log("Error getting blog post: ", err);
        return {data: null, error: "Error getting requested blog post."};
    }
}

export async function starPostById(postId){
    try{
        const starredPost = await blogAPI.starPostById(postId);
        if(!starredPost.error) {
            return {data: starredPost, error: null};
        }
        return {data : null, error: "Failed to star requested blog post."};
    }catch(err){
        console.log("Error starring blog post: ", err);
        return {data: null, error: "Error starring requested blog post."};
    }
}

export async function unstarPostById(postId){
    try{
        const unstarredPost = await blogAPI.unstarPostById(postId);
        if(!unstarredPost.error) {
            return {data: unstarredPost, error: null};
        }
        return {data : null, error: "Failed to unstar requested blog post."};
    }catch(err){
        console.log("Error unstarring blog post: ", err);
        return {data: null, error: "Error unstarring requested blog post."};
    }
}