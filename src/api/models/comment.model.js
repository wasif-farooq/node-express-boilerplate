const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');
const { omitBy, isNil } = require('lodash');

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
    const fields = ['id', 'message', 'createdBy', 'updatedBy'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  removePostComments(owner) {
    Comment.findOneAndRemove({
      'owner.$id': owner
    });
  }
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
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
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
       }) {
    const options = omitBy({ message }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef RefreshToken
 */
const comment = mongoose.model('Comment', commentSchema);
module.exports = comment;
