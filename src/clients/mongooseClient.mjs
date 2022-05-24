import mongoose from 'mongoose';
import { UserComment } from '#src/Models/commentModel.mjs';
import { UserPost } from '#src/Models/postModel.mjs'
import config from 'config';
import winston from 'winston';

function cacheWithRedis(redisClient){
  mongoose.Query.prototype.cache = function(time = 60 * 60){
    this.cacheMe = true; 
    this.cacheTime = time;
    return this;
  }

  const save = mongoose.Model.prototype.save;
  mongoose.Model.prototype.save = async function(){
    let result = await save.apply(this, arguments);
    
    // if a post_id is present, a comment is being created, 
    // bust the cache for (get all comments for a user) and (get all comments for a post)
    if(this.post_id){
      clearCachedData(`comments${this.post_id}`, 'save');
      clearCachedData(`comments${this.user_id}`, 'save');
    }else{
      // a post is being created, bust the cache for (get all posts for a user)
      clearCachedData(`posts${this.user_id}`, 'save');
    }
    return result
  }

  const exec = mongoose.Query.prototype.exec;
  mongoose.Query.prototype.exec = async function(){
    const collectionName = this.mongooseCollection.name;
    const query = this.getQuery()
    // (posts + _id) an individual post 
    // (posts + user_id) all posts for a user
    // (comments + _id) an individual comment
    // (comments + user_id) all comments for a user
    // (comments + post_id) all comments for a post
    const key  = `${collectionName}${query._id || query.user_id || query.post_id}`
    winston.debug(`KEY: ${key}`)
    
    if(this.cacheMe){   
      const cachedResults = await redisClient.GET(key);
      
      if (cachedResults){
        // if you found cached results return it;, You can't insert json straight to redis, it needs to be a string 
        winston.debug(`retrieved from redis cache:  ${cachedResults}`)
        const result = JSON.parse(cachedResults);
        return result;
      }
      //else get results from Database then cache it
      const result = await exec.apply(this, arguments); 

      winston.debug(`Cache set for key ${key}`)
      redisClient.set(key, JSON.stringify(result))
      return result;
    }

    const result = await exec.apply(this, arguments);
    
    // bust individual post / comment 
    clearCachedData(key, this.op);

    // bust all comments for an individual post, (comments + post_id): [all comments]
    clearCachedData(`comments${result.post_id}`, this.op);

    if(!query.user_id){
      // bust all posts/comments for an individual user, (posts/comments + user_id): [all posts/comments]
      clearCachedData(`${collectionName}${result.user_id}`, this.op);
    }

    return result
  }

  async function clearCachedData(key, op){
    const allowedCacheOps = ["find","findById","findOne"];
    // if operation is insert or delete or update for any collection that exists and has cached values delete them
      if (!allowedCacheOps.includes(op) && await redisClient.EXISTS(key)){
        winston.debug(`Cache cleared for key ${key}`)
        redisClient.DEL(key);
      }
  }
}
function connect(){
    // make the pool size small because only running locally, can use env variable to alter this 
    mongoose.connect(config.get('mongo.url'), {maxPoolSize: 3})
}

function disconnect(){
    mongoose.disconnect()
}

async function createPost(user_id, content){
  
  const post = new UserPost({ 
    user_id,
    content,
  });

  await post.save();
  winston.debug(`created post, post_id: ${post._id}`)
  return post._id
}

async function updatePost(_id, content){
  const updatedPost = await UserPost.findOneAndUpdate({ _id }, {content}, {new: true});
  winston.debug(`updated post: ${updatedPost}`)
  return updatedPost
}

async function getPostByID(_id){
  const retrievedPost = await UserPost.findById(_id).cache()
  winston.debug(`retrieved post by id: ${retrievedPost}`)
  return retrievedPost
}

async function getPostsByUserID(user_id){
  const allPosts = await UserPost.find({user_id}).cache()
  winston.debug(`retrieved all posts for user: ${allPosts}`)
  return allPosts
}

async function deletePostByID(_id){
  const deletedResponse = await UserPost.findByIdAndDelete(_id);
  winston.debug(`deleted post by id: ${deletedResponse}`)
  return deletedResponse
}

/*
 * Comment Section
 */
async function createComment(post_id, user_id, content){  
  const comment = new UserComment({
    post_id, 
    user_id,
    content,
  });

  await comment.save();
  winston.debug(`created comment, comment_id: ${comment._id}`)
  return comment._id
}

async function updateComment(_id, content){
  const updatedComment = await UserComment.findOneAndUpdate({ _id }, {content}, {new: true});
  winston.debug(`updated comment: ${updatedComment}`)
  return updatedComment
}

async function getCommentByID(_id){
  const retrievedComment = await UserComment.findById(_id).cache()
  winston.debug(`retrieved comment by id: ${retrievedComment}`)
  return retrievedComment
}

async function getCommentsByUserID(user_id){
  const allComments = await UserComment.find({ user_id }).cache();
  winston.debug(`retrieved all comments for user: ${allComments}`)
  return allComments
}

async function getCommentsByPostID(post_id){
  const allComments = await UserComment.find({ post_id }).cache();
  winston.debug(`retrieved all comments for post: ${allComments}`)
  return allComments
}

async function deleteCommentByID(_id){
  const deletedResponse = await UserComment.findByIdAndDelete(_id);
  winston.debug(`deleted comment by id: ${deletedResponse}`)
  return deletedResponse
}

export default {
  cacheWithRedis,
  connect,
  disconnect,
  createPost,
  updatePost,
  getPostByID,
  getPostsByUserID,
  deletePostByID,
  createComment,
  updateComment,
  getCommentByID,
  getCommentsByUserID,
  getCommentsByPostID,
  deleteCommentByID
}

// https://mongoosejs.com/docs/connections.html#connection_pools
// https://www.mongodb.com/docs/manual/reference/method/ObjectId.getTimestamp/