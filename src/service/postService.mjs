import mongooseWrapper from '../clients/mongooseWrapper.mjs'

async function createPost(user_id, content){
    console.log(`created a post for ${user_id} with text ${content}`)
    const response = await mongooseWrapper.createPost(user_id, content);
    return response
}

async function updatePost(post_id, content){
    console.log(`updated a post ${post_id} with ${content}`);
    return await mongooseWrapper.updatePost(post_id, content); 
}

async function getPost(post_id){
    console.log(`getPost called with ${post_id}`)
    const response = await mongooseWrapper.getPostByID(post_id);
    return response;
}

// fix me 
async function getPosts(user_id){
    console.log(`getPosts called with ${user_id}`)
    return await mongooseWrapper.getPostsByUserID(user_id);
}
// fix me 

async function deletePost(post_id){
    console.log(`deleted post ${post_id}`);
    return await mongooseWrapper.deletePostByID(post_id);
}

export default {
    createPost,
    updatePost,
    getPost,
    getPosts,
    deletePost
}