const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/post.controller');
const commentController = require('../../controllers/comment.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listPosts,
  createPost,
  replacePost,
  updatePost,
} = require('../../validations/post.validation');

const {
  listComments,
  createComment,
} = require('../../validations/comment.validation');

const router = express.Router();

/**
 * Load post when API with postId route parameter is hit
 */
router.param('postId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/posts List Posts
   * @apiDescription Get a list of posts
   * @apiVersion 1.0.0
   * @apiName ListPosts
   * @apiGroup Post
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Post's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Posts per page
   * @apiParam  {String}             [name]       Post's name
   * @apiParam  {String}             [email]      Post's email
   * @apiParam  {String=post,admin}  [role]       Post's role
   *
   * @apiSuccess {Object[]} posts List of posts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated posts can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listPosts), controller.list)
  /**
   * @api {post} v1/posts Create Post
   * @apiDescription Create a new post
   * @apiVersion 1.0.0
   * @apiName CreatePost
   * @apiGroup Post
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Post's access token
   *
   * @apiParam  {String}             email     Post's email
   * @apiParam  {String{6..128}}     password  Post's password
   * @apiParam  {String{..128}}      [name]    Post's name
   * @apiParam  {String=post,admin}  [role]    Post's role
   *
   * @apiSuccess (Created 201) {String}  id         Post's id
   * @apiSuccess (Created 201) {String}  name       Post's name
   * @apiSuccess (Created 201) {String}  email      Post's email
   * @apiSuccess (Created 201) {String}  role       Post's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated posts can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createPost), controller.create);

router
  .route('/:postId')
  /**
   * @api {get} v1/posts/:id Get Post
   * @apiDescription Get post information
   * @apiVersion 1.0.0
   * @apiName GetPost
   * @apiGroup Post
   * @apiPermission post
   *
   * @apiHeader {String} Authorization   Post's access token
   *
   * @apiSuccess {String}  id         Post's id
   * @apiSuccess {String}  name       Post's name
   * @apiSuccess {String}  email      Post's email
   * @apiSuccess {String}  role       Post's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated posts can access the data
   * @apiError (Forbidden 403)    Forbidden    Only post with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {put} v1/posts/:id Replace Post
   * @apiDescription Replace the whole post document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplacePost
   * @apiGroup Post
   * @apiPermission post
   *
   * @apiHeader {String} Authorization   Post's access token
   *
   * @apiParam  {String}             email     Post's email
   * @apiParam  {String{6..128}}     password  Post's password
   * @apiParam  {String{..128}}      [name]    Post's name
   * @apiParam  {String=post,admin}  [role]    Post's role
   * (You must be an admin to change the post's role)
   *
   * @apiSuccess {String}  id         Post's id
   * @apiSuccess {String}  name       Post's name
   * @apiSuccess {String}  email      Post's email
   * @apiSuccess {String}  role       Post's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated posts can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only post with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .put(authorize(LOGGED_USER), validate(replacePost), controller.replace)
  /**
   * @api {patch} v1/posts/:id Update Post
   * @apiDescription Update some fields of a post document
   * @apiVersion 1.0.0
   * @apiName UpdatePost
   * @apiGroup Post
   * @apiPermission post
   *
   * @apiHeader {String} Authorization   Post's access token
   *
   * @apiParam  {String}             email     Post's email
   * @apiParam  {String{6..128}}     password  Post's password
   * @apiParam  {String{..128}}      [name]    Post's name
   * @apiParam  {String=post,admin}  [role]    Post's role
   * (You must be an admin to change the post's role)
   *
   * @apiSuccess {String}  id         Post's id
   * @apiSuccess {String}  name       Post's name
   * @apiSuccess {String}  email      Post's email
   * @apiSuccess {String}  role       Post's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated posts can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only post with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .patch(authorize(LOGGED_USER), validate(updatePost), controller.update)
  /**
   * @api {patch} v1/posts/:id Delete Post
   * @apiDescription Delete a post
   * @apiVersion 1.0.0
   * @apiName DeletePost
   * @apiGroup Post
   * @apiPermission post
   *
   * @apiHeader {String} Authorization   Post's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated posts can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only post with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Post does not exist
   */
  .delete(authorize(LOGGED_USER), controller.remove);

router
  .route('/:postId/comments')
  /**
   * @api {get} v1/posts/:id Get Post
   * @apiDescription Get post information
   * @apiVersion 1.0.0
   * @apiName GetPost
   * @apiGroup Post
   * @apiPermission post
   *
   * @apiHeader {String} Authorization   Post's access token
   *
   * @apiSuccess {String}  id         Post's id
   * @apiSuccess {String}  name       Post's name
   * @apiSuccess {String}  email      Post's email
   * @apiSuccess {String}  role       Post's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated posts can access the data
   * @apiError (Forbidden 403)    Forbidden    Only post with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Post does not exist
   */
  .get(authorize(LOGGED_USER), validate(listComments), commentController.list)

  /**
   * @api {post} v1/posts Create Post
   * @apiDescription Create a new post
   * @apiVersion 1.0.0
   * @apiName CreatePost
   * @apiGroup Post
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Post's access token
   *
   * @apiParam  {String}             email     Post's email
   * @apiParam  {String{6..128}}     password  Post's password
   * @apiParam  {String{..128}}      [name]    Post's name
   * @apiParam  {String=post,admin}  [role]    Post's role
   *
   * @apiSuccess (Created 201) {String}  id         Post's id
   * @apiSuccess (Created 201) {String}  name       Post's name
   * @apiSuccess (Created 201) {String}  email      Post's email
   * @apiSuccess (Created 201) {String}  role       Post's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated posts can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(LOGGED_USER), validate(createComment), commentController.create);

module.exports = router;
