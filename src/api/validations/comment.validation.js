const Joi = require('joi');
const Comment = require('../models/comment.model');

module.exports = {

  // GET /v1/comments
  listComments: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      title: Joi.string(),
    },
    params: {
      postId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/comments
  createComment: {
    body: {
      message: Joi.string().required()
    },
    params: {
      postId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PUT /v1/comments/:commentId
  replaceComment: {
    body: {
      message: Joi.string().required()
    },
    params: {
      commentId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/comments/:commentId
  updateComment: {
    body: {
      message: Joi.string().required()
    },
    params: {
      commentId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
