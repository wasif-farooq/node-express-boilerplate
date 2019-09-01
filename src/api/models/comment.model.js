const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');

/**
 * Refresh Token Schema
 * @private
 */
const commentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    index: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  timestamps: true,
});

commentSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'message', 'postId', 'createdBy', 'updatedBy'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

commentSchema.statics = {
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
        comment = await this.findById(id).exec();
      }
      if (user) {
        return comment;
      }

      throw new APIError({
        message: 'Comment does not exist',
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
         page = 1, perPage = 30, message
       }, { postId }) {
    const options = omitBy({ message, postId }, isNil);

    console.log("options : ", options);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * check if the current user own this comment or not
   *
   * @param {string} id - comment id to check for owner.
   * @param {string} user - current user id to compare with
   * @returns {boolean}
   */
  async checkOnwer(id, user) {
    const comment = await this.findById(id).exec();
    if (comment.createdBy.toString() !== user.toString()) {
      return false;
    }
    return true;
  },

  async remove(id) {
    return this.findOneAndRemove(id).exec();
  },

  async removePostComments(id) {
    return this.find({
      'postId': id
    }).remove();
  },

  async removeUserComments(id) {
    return this.find({
      'createdBy': id
    }).remove();
  }
};

/**
 * @typedef RefreshToken
 */
const comment = mongoose.model('Comment', commentSchema);
module.exports = comment;
