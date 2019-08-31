const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');

/**
 * Refresh Token Schema
 * @private
 */
const chatSchema = new mongoose.Schema({
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

chatSchema.statics = {

  transform() {
    const transformed = {};
    const fields = ['id', 'message', 'createdBy', 'updatedBy'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
};

/**
 * @typedef RefreshToken
 */
const chat = mongoose.model('Chat', chatSchema);
module.exports = chat;
