const httpStatus = require('http-status');
const { omit } = require('lodash');
const Post = require('../models/post.model');


/**
 * Load post and append to req.
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
 * Get post
 * @public
 */
exports.get = (req, res) => res.json(req.locals.post.transform());


/**
 * Get logged in post info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.post.transform());


/**
 * Create new post
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const post = new Post(req.body);
    const savedPost = await Post.save();
    res.status(httpStatus.CREATED);
    res.json(savedPost.transform());
  } catch (error) {
    next(Post.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing post
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { post } = req.locals;
    const newPost = new Post(req.body);
    const ommitRole = post.role !== 'admin' ? 'role' : '';
    const newPostObject = omit(newPost.toObject(), '_id', ommitRole);

    await post.update(newPostObject, { override: true, upsert: true });
    const savedPost = await Post.findById(post._id);

    res.json(savedPost.transform());
  } catch (error) {
    next(Post.checkDuplicateEmail(error));
  }
};


/**
 * Update existing post
 * @public
 */
exports.update = (req, res, next) => {
  const updatedPost = omit(req.body);
  const post = Object.assign(req.locals.post, updatedPost);

  post.save()
    .then(savedPost => res.json(savedPost.transform()));
};


/**
 * Get post list
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
 * Delete post
 * @public
 */
exports.remove = (req, res, next) => {
  const { post } = req.locals;

  post.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
