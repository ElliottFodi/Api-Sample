
import express from 'express'; 
import postController from '#src/controller/postController.mjs'
import commentController from '#src/controller/commentController.mjs'
import { body, param } from 'express-validator'
import bodyParser from 'body-parser';
import helmet from 'helmet';
import healthcheck from 'express-healthcheck';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml'
import fs from 'fs';

const file = fs.readFileSync('./swagger.yml', 'utf8')
const swaggerYAML = YAML.parse(file)

const app = express()
app.use(bodyParser.json())
app.use('/healthcheck', healthcheck());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerYAML));
app.use(helmet());
app.disable('x-powered-by');

/* Post Routes */
app.post(
    '/post', 
    body('user_id').isLength({min: 1, max: 30}),
    body('content').notEmpty(),
    postController.createPost
)
app.get('/posts/:user_id', param('user_id').notEmpty().isLength({min: 1, max: 30}), postController.getPosts)
app.get('/post/:post_id', param('post_id').notEmpty().isMongoId(), postController.getPost)
app.put('/post', body('post_id').notEmpty().isMongoId(), body('content').notEmpty(), postController.updatePost)
app.delete('/post/:post_id', param('post_id').notEmpty().isMongoId(), postController.deletePost)

/* Comment Routes */
app.post(
    '/comment',
    body('post_id').notEmpty().isMongoId(),
    body('user_id').isLength({min: 1, max: 30}),
    body('content').notEmpty(),
    commentController.createComment
)
app.get('/comment/user/:user_id', param('user_id').notEmpty().isLength({min: 1, max: 30}), commentController.getCommentsForUser)
app.get('/comment/:comment_id', param('comment_id').notEmpty().isMongoId(), commentController.getComment)
app.get('/comment/post/:post_id', param('post_id').notEmpty().isMongoId(), commentController.getCommentsForPost)
app.put('/comment', body('comment_id').notEmpty().isMongoId(), body('content').notEmpty(),commentController.updateComment)
app.delete('/comment/:comment_id', param('comment_id').notEmpty().isMongoId(), commentController.deleteComment)

export default app;
