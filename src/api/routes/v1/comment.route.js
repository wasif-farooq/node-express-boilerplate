const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/comment.controller');
const userController = require('../../controllers/user.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { isOwner } = require('../../middlewares/owner');
const Comment = require('../models/comment.model');
const {
  replaceComment,
  updateComment,
} = require('../../validations/comment.validation');

const router = express.Router();


/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', userController.load);

router
  .route('/:commentId')
  /**
   * @api {get} v1/comments/:id Get Comment
   * @apiDescription Get comment information
   * @apiVersion 1.0.0
   * @apiName GetComment
   * @apiGroup Comment
   * @apiPermission comment
   *
   * @apiHeader {String} Authorization   Comment's access token
   *
   * @apiSuccess {String}  id         Comment's id
   * @apiSuccess {String}  name       Comment's name
   * @apiSuccess {String}  email      Comment's email
   * @apiSuccess {String}  role       Comment's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated comments can access the data
   * @apiError (Forbidden 403)    Forbidden    Only comment with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Comment does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {put} v1/comments/:id Replace Comment
   * @apiDescription Replace the whole comment document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceComment
   * @apiGroup Comment
   * @apiPermission comment
   *
   * @apiHeader {String} Authorization   Comment's access token
   *
   * @apiParam  {String}             email     Comment's email
   * @apiParam  {String{6..128}}     password  Comment's password
   * @apiParam  {String{..128}}      [name]    Comment's name
   * @apiParam  {String=comment,admin}  [role]    Comment's role
   * (You must be an admin to change the comment's role)
   *
   * @apiSuccess {String}  id         Comment's id
   * @apiSuccess {String}  name       Comment's name
   * @apiSuccess {String}  email      Comment's email
   * @apiSuccess {String}  role       Comment's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated comments can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only comment with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Comment does not exist
   */
  .put(authorize(LOGGED_USER), validate(replaceComment), isOwner('commentId', Comment), controller.replace)
  /**
   * @api {patch} v1/comments/:id Update Comment
   * @apiDescription Update some fields of a comment document
   * @apiVersion 1.0.0
   * @apiName UpdateComment
   * @apiGroup Comment
   * @apiPermission comment
   *
   * @apiHeader {String} Authorization   Comment's access token
   *
   * @apiParam  {String}             email     Comment's email
   * @apiParam  {String{6..128}}     password  Comment's password
   * @apiParam  {String{..128}}      [name]    Comment's name
   * @apiParam  {String=comment,admin}  [role]    Comment's role
   * (You must be an admin to change the comment's role)
   *
   * @apiSuccess {String}  id         Comment's id
   * @apiSuccess {String}  name       Comment's name
   * @apiSuccess {String}  email      Comment's email
   * @apiSuccess {String}  role       Comment's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated comments can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only comment with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Comment does not exist
   */
  .patch(authorize(LOGGED_USER), validate(updateComment), isOwner('commentId', Comment),controller.update)
  /**
   * @api {patch} v1/comments/:id Delete Comment
   * @apiDescription Delete a comment
   * @apiVersion 1.0.0
   * @apiName DeleteComment
   * @apiGroup Comment
   * @apiPermission comment
   *
   * @apiHeader {String} Authorization   Comment's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated comments can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only comment with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Comment does not exist
   */
  .delete(authorize(LOGGED_USER), isOwner('commentId', Comment),controller.remove);


module.exports = router;
