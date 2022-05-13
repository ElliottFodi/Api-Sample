
import express from 'express'; 
import postController from '../controller/postController.mjs'
import commentController from '../controller/commentController.mjs'
import { body, param, validationResult } from 'express-validator'
import bodyParser from 'body-parser';
import process from 'process';
import helmet from 'helmet';
import healthcheck from 'express-healthcheck';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Post Micro Service',
        version: '1.0.0',
      },
    },
    apis: ['./src/Routes/routes.mjs'],
  };
const openapiSpecification = swaggerJSDoc(options);


const app = express()
app.use(bodyParser.json())
app.use('/healthcheck', healthcheck());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

const port = 8080

process.on('SIGINT', function onSigint() {
    console.log('sigint process exit');
    process.exit();
});

process.on('SIGTERM', function onSigterm() {
    console.log('sigterm process exit');
    process.exit();
});

app.use(helmet());
app.disable('x-powered-by');

/**
 * @openapi
 * /post:
 *   post:
 *     summery: Create post for a given user_iD
 *     requestBody: 
 *       description: New post request object
 *       required: true
 *       content:
 *         application/json: 
 *           schema:
 *             type: object 
 *             properties:
 *               user_id:
 *                 type: string
 *               content: 
 *                 type: string
 *           example:
 *             user_id: "1234"
 *             content: "hello world post"
 *     responses:
 *       200:
 *         description: post_id.
 */
app.post(
    '/post', 
    body('user_id').isLength({min: 1, max: 30}),
    // body('createdTimeStamp').notEmpty().isInt(),
    body('content').notEmpty(),
    postController.createPost
)

/**
 * @openapi
 * /posts/{user_id}:
 *   get:
 *     summery: Get all posts for a given user_id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         type: string
 *         required: true
 *         description: Get all posts for a given user_id 
 *     responses:
 *       200:
 *         description: post Objects.
 */
app.get('/posts/:user_id', param('user_id').notEmpty().isLength({min: 1, max: 30}), postController.getPosts)

/**
 * @openapi
 * /post/{post_id}:
 *   get:
 *     summery: Get a post for a given post_id
 *     parameters:
 *       - in: path
 *         name: post_id
 *         type: string
 *         required: true
 *         description: get a post for a given post_id
 *     responses:
 *       200:
 *         description: post Object.
 */
app.get('/post/:post_id', param('post_id').notEmpty().isMongoId(), postController.getPost)

/**
 * @openapi
 * /post:
 *   put:
 *     summery: Update a post for a given post_id
 *     requestBody: 
 *       description: Update request object
 *       required: true
 *       content:
 *         application/json: 
 *           schema:
 *             type: object 
 *             properties:
 *               post_id:
 *                 type: string
 *               content: 
 *                 type: string
 *           example:
 *             post_id: "paste post_id here"
 *             content: "hello world post update"
 *     responses:
 *       200:
 *         description: updated post Object.
 */
app.put('/post', body('post_id').notEmpty().isMongoId(), body('content').notEmpty(), postController.updatePost)

/**
 * @openapi
 * /post/{post_id}:
 *   delete:
 *     summery: Delete a post for a given post_id
 *     parameters:
 *       - in: path
 *         name: post_id
 *         type: string
 *         required: true
 *         description: delete a post for a given post_id 
 *     responses:
 *       200:
 *         description: deleted post Object.
 */
app.delete('/post/:post_id', param('post_id').notEmpty().isMongoId(), postController.deletePost)

/*
 * Comment Routes
 */

/**
 * @openapi
 * /comment:
 *   post:
 *     summery: Create comment for a given user_id
 *     requestBody: 
 *       description: New a comment object
 *       required: true
 *       content:
 *         application/json: 
 *           schema:
 *             type: object 
 *             properties:
 *               post_id: 
 *                 type: string
 *               user_id:
 *                 type: string
 *               content: 
 *                 type: string
 *           example:
 *             post_id: "paste post_id here"
 *             user_id: "9999"
 *             content: "hello world comment"
 *     responses:
 *       200:
 *         description: comment_id.
 */
app.post(
    '/comment',
    body('post_id').notEmpty().isMongoId(),
    body('user_id').isLength({min: 1, max: 30}),
    body('content').notEmpty(),
    commentController.createComment
)

/**
 * @openapi
 * /comments/{user_id}:
 *   get:
 *     summery: Get all comments for a given user_id
 *     parameters:
 *       - in: path
 *         name: user_id
 *         type: string
 *         required: true
 *         description: Get all comments for a given user_id
 *     responses:
 *       200:
 *         description: comment Objects.
 */
app.get('/comments/:user_id', param('user_id').notEmpty().isLength({min: 1, max: 30}), commentController.getComments)

/**
 * @openapi
 * /comment/{comment_id}:
 *   get:
 *     summery: Get a comment for a given comment_id
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         type: string
 *         required: true
 *         description: get a comment for a given comment_iD 
 *     responses:
 *       200:
 *         description: comment Object.
 */
app.get('/comment/:comment_id', param('comment_id').notEmpty().isMongoId(), commentController.getComment)

/**
 * @openapi
 * /comment:
 *   put:
 *     summery: Update a comment for a given comment_id
 *     requestBody: 
 *       description: Update Comment object
 *       required: true
 *       content:
 *         application/json: 
 *           schema:
 *             type: object 
 *             properties:
 *               comment_id:
 *                 type: string
 *               content: 
 *                 type: string
 *           example:
 *             comment_id: "paste in commentId here"
 *             content: "hello world comment updated"
 *     responses:
 *       200:
 *         description: updated comment object.
 */
app.put('/comment', body('comment_id').notEmpty().isMongoId(), body('content').notEmpty(),commentController.updateComment)

/**
 * @openapi
 * /comment/{comment_id}:
 *   delete:
 *     summery: Delete a comment for a given comment_id
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         type: string
 *         required: true
 *         description: delete a comment for a given comment_id 
 *     responses:
 *       200:
 *         description: deleted comment object.
 */
app.delete('/comment/:comment_id', param('comment_id').notEmpty().isMongoId(), commentController.deleteComment)

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))

