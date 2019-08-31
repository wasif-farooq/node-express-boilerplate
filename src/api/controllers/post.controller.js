const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../models/user.model');
const Post = require('../models/post.model');


/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const post = await Post.get(id);
    req.locals = { post };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.post.transform());


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
    const post = new User(req.body);
    const savedPost = await Post.save();
    res.status(httpStatus.CREATED);
    res.json(savedPost.transform());
  } catch (error) {
    next(Post.checkDuplicateEmail(error));
  }
};


/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedPost = omit(req.body);
  const post = Object.assign(req.locals.post, updatedPost);

  post.save()
    .then(savedPost => res.json(savedPost.transform()));
};


/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const posts = await Post.list(req.query);
    const transformedPosts = posts.map(post => post.transform());
    res.json(transformedPosts);
  } catch (error) {
    next(error);
  }
};


/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { post } = req.locals;

  post.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
