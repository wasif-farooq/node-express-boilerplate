const APIError = require('../utils/APIError');
const httpStatus = require('http-status');

module.exports = {
  isOwner: function(idField, model) {
    return function(req, res, next, err) {
      if (!model.checkOwner(req.params[idField], req.user._id)) {
        throw new APIError({
          message: 'You not allowed to perfome this action',
          status: httpStatus.FORBIDDEN,
        });
      }
      return next()
    }
  }
}
