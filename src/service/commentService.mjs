// retrun the sorted comments ordered by time stamp 
// might need pagination 
import mongooseWrapper from '../clients/mongooseWrapper.mjs'

async function createComment(post_id, user_id, content){
    console.log(`created a comment for ${user_id} : ${post_id} with text ${content}`)
    const response = await mongooseWrapper.createComment(post_id, user_id, content);
    return response
}

async function updateComment(comment_id, content){
    console.log(`updated a comment with comment id: ${comment_id} and content ${content}`);
    return await mongooseWrapper.updateComment(comment_id, content); 
}

async function getComment(comment_id){
    console.log(`getComment called with comment id:  ${comment_id}`)
    const response = await mongooseWrapper.getCommentByID(comment_id);
    return response;
}

async function getComments(user_id){
    console.log(`getComments called with user id: ${user_id}`)
    return await mongooseWrapper.getCommentsByUserID(user_id);
}

async function deleteComment(comment_id){
    console.log(`deleted a comment with id: ${comment_id}`);
    return await mongooseWrapper.deleteCommentByID(comment_id);
}

export default {
    createComment,
    updateComment,
    getComment,
    getComments,
    deleteComment
}