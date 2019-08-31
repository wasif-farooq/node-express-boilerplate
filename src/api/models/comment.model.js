const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');

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
  owner: {
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

postSchema.statics = {
  transform() {
    const transformed = {};
    const fields = ['id', 'message', 'owner', 'createdBy', 'updatedBy'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }

};

/**
 * @typedef RefreshToken
 */
const comment = mongoose.model('Comment', commentSchema);
module.exports = comment;
