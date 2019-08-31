const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');
const Comment = require('./comment.model');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');

/**
 * Refresh Token Schema
 * @private
 */
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  active: {
    type: Boolean,
    default: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});



/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
postSchema.pre('remove', async function save(next) {
  try {
    await Comment.removePostComments(this.id);
    return next();
  } catch (error) {
    return next(error);
  }
});

postSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'title', 'message', 'createdBy', 'updatedBy'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  async remveUserPosts(owner) {
    await Post.findOneAndRemove({
      'owner.$id': owner
    });
  }
});

postSchema.statics = {
  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: 'Post does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
         page = 1, perPage = 30, title
       }) {
    const options = omitBy({ title }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async remove(id, user) {
    const post = await this.findById(id).exec();
    console.log(post.createdBy.toString(), user);
    if (post.createdBy.toString() !== user.toString()) {
      throw new APIError({
        message: 'You not allowed to perfome this action',
        status: httpStatus.FORBIDDEN,
      });
    }
    return this.findOneAndRemove(id).exec();
  },
};
/**
 * @typedef RefreshToken
 */
const post = mongoose.model('Post', postSchema);
module.exports = post;
