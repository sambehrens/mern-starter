// libraries
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

// misc
const ApiHelper = require('../utils/apiHelper');
const { httpCodes } = require('../lib/constants');

// input validation
const { validateRegisterUser, validatePassword } = require('../validation/user/registerUser');
const validateLoginInput = require('../validation/user/login');

// middleware
const { restrictUser, removeFieldsFromResponse } = require('../utils/expressMiddleware');
const sendJwt = require('../utils/expressMiddleware').sendJwt;

const removeEmailFromSingleRecordResponse = () => {
  return (req, res, next) => {
    if (req.user.id !== req.params.id && req.user.accessLevel !== 'Admin') {
      removeFieldsFromResponse(['email'])(req, res, next);
    } else {
      next();
    }
  };
};

const removeEmailFromMultiRecordResponse = () => {
  return (req, res, next) => {
    if (req.doc) {
      req.doc.forEach((doc) => {
        if (!doc._id.equals(req.user.id) && req.user.accessLevel !== 'Admin') {
          doc['email'] = null;
        }
      });
    }
    next();
  };
};

const restrictChangingAccessLevelToAdminsOnly = (req, res, next) => {
  const userEdits = req.body || {};

  if (req.user.accessLevel !== 'Admin' && userEdits.accessLevel) {
    return res.status(httpCodes.FORBIDDEN).json({ error: 'User not authorized to change access level' });
  }

  next();
};

const restrictEditingUserToAdminsAndThemself = (req, res, next) => {
  if (req.user.accessLevel !== 'Admin' && req.params.id !== req.user.id) {
    return res.status(httpCodes.FORBIDDEN).json({ error: 'User cannot edit other users' });
  }

  next();
};

const router = express.Router();

const modelName = 'User';

// @route DELETE api/users/:id
router.delete('/:id', passport.authenticate('jwt', { session: false }), restrictUser(), (req, res) => {
  if (req.params.id !== req.user.id) {
    return res.status(httpCodes.BAD_REQUEST).json('A user cannot delete others.');
  }

  const id = mongoose.Types.ObjectId(req.params.id);
  mongoose.model(modelName).findByIdAndDelete(id, (err, doc) => {
    if (err) {
      return res.status(httpCodes.BAD_REQUEST).json(err);
    }
    if (!doc) {
      return res.status(httpCodes.NOT_FOUND).json({ _id: `Document id '${req.params.id}' does not exist` });
    }

    return res.json(doc);
  });
});

// @route POST api/users/
router.post('/', (req, res) => {
  const newUser = new mongoose.model(modelName)(req.body);

  const { errors, isValid } = validateRegisterUser(req.body);
  if (!isValid) {
    return res.status(httpCodes.BAD_REQUEST).json(errors);
  }

  if (newUser.accessLevel === 'Admin') {
    return res.status(httpCodes.BAD_REQUEST).json({ error: 'Access level must start as "User"' });
  }

  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return res.status(httpCodes.BAD_REQUEST).json(err);
    }

    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        return res.status(httpCodes.BAD_REQUEST).json(err);
      }

      newUser.password = hash;
      newUser
        .save()
        .then((user) => {
          return res.json(user);
        })
        .catch((err) => {
          return res.status(httpCodes.BAD_REQUEST).json(err);
        });
    });
  });
});

// @route POST api/users/login
router.post(
  '/login',
  (req, res, next) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(httpCodes.BAD_REQUEST).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    const notFoundError = {
      error: 'Email and password combination not found',
    };

    // Find User by email
    mongoose
      .model(modelName)
      .findOne({ email })
      .then((user) => {
        // Check if User exists
        if (!user) {
          return res.status(httpCodes.NOT_FOUND).json(notFoundError);
        }

        // Check password
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            req.user = user;
            next();
          } else {
            return res.status(httpCodes.NOT_FOUND).json(notFoundError);
          }
        });
      });
  },
  sendJwt
);

// @route GET api/users/refresh-token
router.get('/refresh-token', passport.authenticate('jwt', { session: false }), sendJwt);

// @route POST api/users/filter
ApiHelper.filter(router, modelName, [], removeEmailFromMultiRecordResponse());

// @route GET api/users/:id
ApiHelper.get(router, modelName, [], removeEmailFromSingleRecordResponse());

// @route PATCH api/users/:id
ApiHelper.edit(
  router,
  modelName,
  [restrictEditingUserToAdminsAndThemself, restrictChangingAccessLevelToAdminsOnly],
  removeEmailFromSingleRecordResponse()
);

router.put('/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (!req.body.currentPassword) {
    return res.status(httpCodes.BAD_REQUEST).json({ currentPassword: 'Current password is required' });
  }
  const passwordError = validatePassword(req.body.newPassword, 'New password');
  if (passwordError) {
    return res.status(httpCodes.BAD_REQUEST).json({ newPassword: passwordError });
  }

  if (req.body.currentPassword === req.body.newPassword) {
    return res.status(httpCodes.BAD_REQUEST).json({ newPassword: 'New password cannot match current one' });
  }

  // Find User by email
  mongoose
    .model(modelName)
    .findById(req.user.id)
    .then((user) => {
      // Check if User exists
      if (!user) {
        return res.status(httpCodes.NOT_FOUND).json({ error: 'Cannot find user' });
      }

      // Check password
      bcrypt.compare(req.body.currentPassword, user.password).then((isMatch) => {
        if (isMatch) {
          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              return res.status(httpCodes.BAD_REQUEST).json(err);
            }

            bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
              if (err) {
                return res.status(httpCodes.BAD_REQUEST).json(err);
              }

              user.password = hash;
              user
                .save()
                .then(() => res.status(httpCodes.SUCCESS_N0_CONTENT).send())
                .catch((err) => {
                  return res.status(httpCodes.BAD_REQUEST).json(err);
                });
            });
          });
        } else {
          return res.status(httpCodes.NOT_FOUND).json({ currentPassword: 'Current password is incorrect' });
        }
      });
    });
});

module.exports = router;
