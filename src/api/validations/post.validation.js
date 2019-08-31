const Joi = require('joi');
const Post = require('../models/post.model');

module.exports = {

  // GET /v1/posts
  listPosts: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      title: Joi.string(),
    },
  },

  // POST /v1/posts
  createPost: {
    body: {
      title: Joi.string().required(),
      message: Joi.string().required()
    },
  },

  // PUT /v1/posts/:postId
  replacePost: {
    body: {
      title: Joi.string().required(),
      message: Joi.string().required()
    },
    params: {
      postId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/posts/:postId
  updatePost: {
    body: {
      title: Joi.string().required(),
      message: Joi.string().required()
    },
    params: {
      postId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
