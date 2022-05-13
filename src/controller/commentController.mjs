import commentService from "../service/commentService.mjs"
import { validationResult } from 'express-validator'

async function createComment(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const response = await commentService.createComment(
            req.body.post_id, 
            req.body.user_id, 
            req.body.content
        )
        console.log(response)
        res.json({comment_id: response});
    } catch (err){
        next(err)
    }
}

async function getComments(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const comments = await commentService.getComments(req.params.user_id);
        res.json({comments})
    } catch (err){
        next(err)
    }
}

async function getComment(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const comment = await commentService.getComment(req.params.comment_id);
        res.json({comment});
    } catch (err){
        next(err)
    }
}

async function updateComment(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const commentUpdate = await commentService.updateComment(req.body.comment_id, req.body.content);
        res.json({commentUpdate})
    } catch (err){
        next(err)
    }
}

async function deleteComment(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const deletedPost = await commentService.deleteComment(req.params.comment_id)
        res.json({deletedPost})
    } catch (err){
        next(err)
    }
}

export default {
    createComment,
    getComments,
    getComment,
    updateComment,
    deleteComment
}