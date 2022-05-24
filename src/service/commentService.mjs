import mongooseWrapper from '#src/clients/mongooseClient.mjs'
import winston from 'winston'

async function createComment(post_id, user_id, content){
    winston.debug(`created a comment for ${user_id} : ${post_id} with text ${content}`)
    const response = await mongooseWrapper.createComment(post_id, user_id, content);
    return response
}

async function updateComment(comment_id, content){
    winston.debug(`updated a comment with comment_id: ${comment_id} and content ${content}`)
    return await mongooseWrapper.updateComment(comment_id, content); 
}

async function getComment(comment_id){
    winston.debug(`getComment called with comment_id:  ${comment_id}`)
    const response = await mongooseWrapper.getCommentByID(comment_id);
    return response;
}

async function getCommentsForUser(user_id){
    winston.debug(`get all comments for user user_id: ${user_id}`)
    return await mongooseWrapper.getCommentsByUserID(user_id);
}

async function getCommentsForPost(post_id){
    winston.debug(`get all comments for post with post_id: ${post_id}`)
    return await mongooseWrapper.getCommentsByPostID(post_id)
}

async function deleteComment(comment_id){
    winston.debug(`deleted a comment with id: ${comment_id}`)
    return await mongooseWrapper.deleteCommentByID(comment_id);
}

export default {
    createComment,
    updateComment,
    getComment,
    getCommentsForUser,
    getCommentsForPost,
    deleteComment
}