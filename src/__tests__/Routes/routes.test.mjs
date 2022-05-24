import app from '#src/app.mjs'
import request  from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server';
import redisClient from '#src/clients/redisClient'
import { RedisMemoryServer } from 'redis-memory-server';
import mongooseClient from '#src//clients/mongooseClient.mjs';
import {createClient}  from 'redis';
import { UserComment } from '#src/Models/commentModel.mjs';
import { UserPost } from '#src/Models/postModel.mjs'
import winston from 'winston'
import config from 'config'

describe("Post/Comment, End to End CRUD tests:", () => {
  let con;
  let mongoServer;
  let inMemoryRedisClient;
  let redisServer;

  let fakePostId1;
  let fakePostId2;
  let fakePostId3;
  let fakeCommentId1;
  let fakeCommentId2;
  const userId1 = '1234';
  const userId2 = '5678';
  const postContent1 = 'post content 1'
  const postContent2 = 'post content 2'
  const commentContent1 = 'comment content 1'
  const commentContent2 = 'comment content 2'
  
  beforeAll(async () => {

    // hack because winston was noisy, its initialized in the server which is not called
    winston.level = config.get('log.level');
    const consoleTransport = new winston.transports.Console();
    winston.add(consoleTransport);

    /* set up redis in memory server */
    redisServer = new RedisMemoryServer();
    const host = await redisServer.getHost();
    const port = await redisServer.getPort();
    console.log(`redis://${host}:${port}`);

    /* connect to redis in memory server and save client to redisClient */
    inMemoryRedisClient = createClient({url: `redis://${host}:${port}`})
    inMemoryRedisClient.connect()
    redisClient.setClient(inMemoryRedisClient)

    /* set up mongo in memory server */
    mongoServer = await MongoMemoryServer.create();

    /* set up mongoose to use redis as its cache and connect to in memory mongo server*/
    mongooseClient.cacheWithRedis(redisClient.getClient())
    con = await mongoose.connect(mongoServer.getUri(), { dbName: "efuseMongo" });
    
    /* Add test data to run tests against */
    let post = new UserPost({ user_id: userId1, content: postContent1 });
    await post.save();
    fakePostId1 = post._id

    post = new UserPost({ user_id: userId1, content: postContent2 });
    await post.save();
    fakePostId2 = post._id

    post = new UserPost({ user_id: userId2, content: postContent1 });
    await post.save();
    fakePostId3 = post._id

    let comment = new UserComment({ post_id: fakePostId1, user_id: userId1, content: commentContent1});
    await comment.save();
    fakeCommentId1 = comment._id

    comment = new UserComment({ post_id: fakePostId1, user_id: userId2, content: commentContent2});
    await comment.save();
    fakeCommentId2 = comment._id
  });
  
  afterAll(async () => {
    if (con) {
      await con.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    
    await inMemoryRedisClient.quit();
    await redisServer.stop()
  });

  test("create post", async () => {
    const response = await request(app).post("/post").send({
      user_id: '1',
      content: 'my post'
    })
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('post_id')
  });

  test("get post by post_id", async () => {
    const response = await request(app).get(`/post/${fakePostId1}`)
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('post')
    expect(response.body.post).toHaveProperty('_id')
    expect(JSON.stringify(response.body.post._id)).toBe(JSON.stringify(fakePostId1))
    expect(response.body.post).toHaveProperty('user_id')
    expect(response.body.post.user_id).toBe(userId1)
  });

  test("get list of a posts with length 2 for user_id", async () => {
    const response = await request(app).get(`/posts/${userId1}`)
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('posts')
    expect(response.body.posts.length).toBe(2)
  });

  test("update post by post_id", async () => {
    const response = await request(app).put("/post").send({
      post_id: fakePostId1,
      content: 'update post 1'
    })
    expect(response.statusCode).toBe(200);
    expect(response.body.postUpdate).toHaveProperty('_id')
    expect(JSON.stringify(response.body.postUpdate._id)).toBe(JSON.stringify(fakePostId1))
    expect(response.body.postUpdate.content).toBe('update post 1')
  });

  test("delete post by post_is", async () => {
    let response = await request(app).delete(`/post/${fakePostId2}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.deletedPost).toHaveProperty('_id')
    expect(JSON.stringify(response.body.deletedPost._id)).toBe(JSON.stringify(fakePostId2))

    response = await request(app).get(`/post/${fakePostId2}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.post).toBe(null)
  });

  /* comment tests */
  test("create comment", async () => {
    const response = await request(app).post("/comment").send({
      post_id: fakePostId3,
      user_id: '1',
      content: 'my comment'
    })
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('comment_id')
  });

  test("get comment by comment_id", async () => {
    const response = await request(app).get(`/comment/${fakeCommentId1}`)
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('comment')
    expect(response.body.comment).toHaveProperty('_id')
    expect(JSON.stringify(response.body.comment._id)).toBe(JSON.stringify(fakeCommentId1))
    expect(response.body.comment).toHaveProperty('user_id')
    expect(response.body.comment.user_id).toBe(userId1)
  });

  test("get all comments for user by user_id", async () => {
    const response = await request(app).get(`/comment/user/${userId1}`)
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('comments')
    expect(response.body.comments.length).toBe(1)
  });

  test("get all comments for post by post_id", async () => {
    const response = await request(app).get(`/comment/post/${fakePostId1}`)
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('comments')
    expect(response.body.comments.length).toBe(2)
  });

  test("update a comment by comment_id", async () => {
    const response = await request(app).put("/comment").send({
      comment_id: fakeCommentId1,
      content: 'my comment update'
    })
    expect(response.statusCode).toBe(200);
    expect(response.body.commentUpdate).toHaveProperty('_id')
    expect(JSON.stringify(response.body.commentUpdate._id)).toBe(JSON.stringify(fakeCommentId1))
    expect(response.body.commentUpdate.content).toBe('my comment update')
  });

  test("delete comment by comment_id", async () => {
    let response = await request(app).delete(`/comment/${fakeCommentId2}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.deletedComment).toHaveProperty('_id')
    expect(JSON.stringify(response.body.deletedComment._id)).toBe(JSON.stringify(fakeCommentId2))

    response = await request(app).get(`/comment/${fakeCommentId2}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(null)
  });

});
