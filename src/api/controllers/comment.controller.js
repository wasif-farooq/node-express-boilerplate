const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');


/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const comment = await Comment.get(id);
    req.locals = { comment };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.comment.transform());


/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());


/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();
    res.status(httpStatus.CREATED);
    res.json(savedComment.transform());
  } catch (error) {
    next(error);
  }
};


/**
 * Replace existing comment
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { comment } = req.locals;
    const newComment = new Comment(req.body);
    const ommitRole = comment.role !== 'admin' ? 'role' : '';
    const newCommentObject = omit(newComment.toObject(), '_id', ommitRole);

    await comment.update(newCommentObject, { override: true, upsert: true });
    const savedComment = await Comment.findById(comment._id);

    res.json(savedComment.transform());
  } catch (error) {
    next(error);
  }
};


/**
 * Update existing comment
 * @public
 */
exports.update = (req, res, next) => {
  const updatedComment = omit(req.body);
  const comment = Object.assign(req.locals.comment, updatedComment);

  comment.save()
    .then(savedComment => res.json(savedComment.transform()));
};


/**
 * Get commentf list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const comments = await Comment.list(req.query, req.params);
    const transformedComments = comments.map(comment => comment.transform());
    res.json(transformedComments);
  } catch (error) {
    next(error);
  }
};


/**
 * Delete comment
 * @public
 */
exports.remove = (req, res, next) => {
  const commentId = req.params.commentId;

  Comment.remove(commentId, req.user._id)
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
