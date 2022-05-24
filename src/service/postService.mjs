import mongooseWrapper from '#src/clients/mongooseClient.mjs'
import winston from 'winston'

async function createPost(user_id, content){
    winston.debug(`created a post for ${user_id} with text ${content}`)
    const response = await mongooseWrapper.createPost(user_id, content);
    return response
}

async function updatePost(post_id, content){
    winston.debug(`updated a post ${post_id} with ${content}`)
    return await mongooseWrapper.updatePost(post_id, content); 
}

async function getPost(post_id){
    winston.debug(`getPost called with post_id: ${post_id}`)
    const response = await mongooseWrapper.getPostByID(post_id);
    return response;
}

async function getPosts(user_id){
    winston.debug(`getPosts for user called with user_id: ${user_id}`)
    return await mongooseWrapper.getPostsByUserID(user_id);
}

async function deletePost(post_id){
    winston.debug(`deletePost called with post_id: ${post_id}`)
    return await mongooseWrapper.deletePostByID(post_id);
}

export default {
    createPost,
    updatePost,
    getPost,
    getPosts,
    deletePost
}