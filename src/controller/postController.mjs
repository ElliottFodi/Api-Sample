import postService from "#src/service/postService.mjs"
import { validationResult } from 'express-validator'

async function createPost(req, res, next){
    // let ua = new UAParser(req.headers['user-agent']); maybe get an auth header
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const response = await postService.createPost(req.body.user_id, req.body.content)
        console.log(response)
        //TODO decide what to return.  maybe we return the post id 
        res.json({post_id: response});
    } catch (err){
        next(err)
    }
}

async function getPosts(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const posts = await postService.getPosts(req.params.user_id);
        res.json({posts})
    } catch (err){
        next(err)
    }
}

async function getPost(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        console.log('post_id: ', req.params.post_id)
        const post = await postService.getPost(req.params.post_id);
        res.json({post});
    } catch (err){
        next(err)
    }
}

async function updatePost(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const postUpdate = await postService.updatePost(req.body.post_id, req.body.content);
        res.json({postUpdate})
    } catch (err){
        next(err)
    }
}

async function deletePost(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const deletedPost = await postService.deletePost(req.params.post_id)
        res.json({deletedPost})
    } catch (err){
        next(err)
    }
}

export default {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
}