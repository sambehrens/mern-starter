const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');

/**
 * Restricts the given access levels from using the api.
 * @param {string[]} restrictedAccessLevels The array of restricted access levels.
 */
const restrictAccess = function(restrictedAccessLevels = []) {
  return (req, res, next) => {
    const validAccessLevels = ['Admin', 'User'];
    if (!validAccessLevels.includes(req.user.accessLevel)) {
      return res.status(401).json({ message: `'${req.user.accessLevel}' is not a valid access level.` });
    }
    if (restrictedAccessLevels.includes(req.user.accessLevel)) {
      return res.status(401).json({
        message: `Access level '${req.user.accessLevel}' cannot access method '${req.method}' to '${req.originalUrl}'.`,
      });
    }
    next();
  };
};

const removeFieldsFromResponse = function(fields = []) {
  return (req, res, next) => {
    if (req.user.accessLevel !== 'Admin') {
      if (Array.isArray(req.doc)) {
        req.doc.forEach(doc => fields.forEach(field => (doc[field] = null)));
      } else {
        fields.forEach(field => (req.doc[field] = null));
      }
    }
    next();
  };
};

const expressMiddleware = {
  /**
   * Restricts access to the given access levels.
   * @param {string[]} restrictedAccessLevels The array of restricted access levels.
   */
  restrictAccess(restrictedAccessLevels = []) {
    return restrictAccess(restrictedAccessLevels);
  },

  /**
   * Restricts access to volunteers.
   */
  restrictUser() {
    return restrictAccess(['User']);
  },

  removeFieldsFromResponse(fields = []) {
    return removeFieldsFromResponse(fields);
  },

  /**
   * An express middleware that sends a new jwt.
   * @param {Request} req API request
   * @param {Response} res API response
   */
  sendJwt(req, res) {
    // Create JWT Payload, basically what we want to send in the response
    const { user } = req;
    const payload = {
      userId: user.id,
    };

    // Sign token
    return jwt.sign(
      payload,
      keys.jwtKey,
      {
        expiresIn: 39600, // 11 hours in seconds
      },
      (err, token) => {
        if (err) {
          return res.status(400).json(err);
        }

        return res.json({
          token: 'Bearer ' + token,
        });
      }
    );
  },
};

module.exports = expressMiddleware;
