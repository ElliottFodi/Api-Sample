import mongoose from 'mongoose';
import { UserComment } from '../Models/commentModel.mjs';
import { UserPost } from '../Models/postModel.mjs'
import config from 'config';

const dbName = 'efuseMongo';
// make the pool size small because only running locally, can use env variable to alter this 
mongoose.connect(`${config.get('mongo.url')}/${dbName}`, {maxPoolSize: 3})

async function createPost(user_id, content){
  
  const post = new UserPost({ 
    user_id,
    content,
  });

  await post.save();
  return post._id
  // mongoose.connection.close()
}

async function updatePost(_id, content){
  const updatedPost = await UserPost.findOneAndUpdate({ _id }, {content}, {
    new: true
  });
  console.log(updatedPost)
  return updatedPost
}

async function getPostByID(_id){
  // const retrievedPost = await UserPost.findById(_id)
  // console.log(retrievedPost)
  // return retrievedPost
  return await UserPost.findById(_id)
}

async function getPostsByUserID(user_id){
  const allPosts = await UserPost.find({user_id})
  console.log(allPosts)
  return allPosts
}

async function deletePostByID(_id){
  const deletedResponse = await UserPost.findByIdAndDelete(_id);
  return deletedResponse
}

/*
 * Comment Section
 */
async function createComment(post_id, user_id, content){
  // make the pool size small because only running locally, can use env variable to alter this 
  
  const comment = new UserComment({
    post_id, 
    user_id,
    content,
  });

  await comment.save();
  return comment._id
  // mongoose.connection.close()
}

async function updateComment(_id, content){
  const updatedComment = await UserComment.findOneAndUpdate({ _id }, {content}, {
    new: true
  });
  console.log(updatedComment)
  return updatedComment
}

async function getCommentByID(_id){
  const retrievedComment = await UserComment.findById(_id)
  console.log(retrievedComment)
  return retrievedComment
}

async function getCommentsByUserID(user_id){
  const allComments = await UserComment.find({ user_id });
  console.log(allComments)
  return allComments
}

async function deleteCommentByID(_id){
  const deletedResponse = await UserComment.findByIdAndDelete(_id);
  return deletedResponse
}

export default {
  createPost,
  updatePost,
  getPostByID,
  getPostsByUserID,
  deletePostByID,
  createComment,
  updateComment,
  getCommentByID,
  getCommentsByUserID,
  deleteCommentByID
}

// https://mongoosejs.com/docs/connections.html#connection_pools
// https://www.mongodb.com/docs/manual/reference/method/ObjectId.getTimestamp/