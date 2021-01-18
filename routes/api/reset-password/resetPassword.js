const express = require('express');
const Validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SES = require('aws-sdk/clients/ses');

const router = express.Router();
const keys = require('../../../config/keys');
const { httpCodes } = require('../lib/constants');

const { validateRegisterUser } = require('../validation/user/registerUser');

router.post('/email', (req, res) => {
  const { email, url } = req.body;
  if (!url) {
    return res.status(400).json({ url: 'URL is required' });
  }

  if (!email) {
    return res.status(400).json({ email: 'Email is required' });
  }

  if (!Validator.isEmail(email)) {
    return res.status(400).json({ email: 'Email is invalid' });
  }

  mongoose.model('User').findOne({ email }, async (err, user) => {
    if (!user) {
      return res.status(400).json({ email: 'A user does not exist with that email' });
    }

    const payload = {
      id: user.id,
    };

    const key = keys.jwtKey + user.password;
    const token = jwt.sign(payload, key, {
      expiresIn: 604800, // 1 week in seconds
    });

    const msg = {
      Destination: {
        ToAddresses: [email],
      },
      Source: 'mern-starter@gmail.com',
      Template: 'reset_password',
      TemplateData: JSON.stringify({ name: user.name, url: `${url}/reset-password/${token}` }),
      ReplyToAddresses: ['mern-starter@gmail.com'],
    };

    try {
      const ses = new SES();
      await ses.sendTemplatedEmail(msg).promise();
      return res.json({ message: msg });
    } catch (err) {
      console.log('An error occured when sending the email', err);
      return res.status(400).json(err);
    }
  });
});

router.post('/verify', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ token: 'Token is required' });
  }

  let decodedPayload;

  try {
    decodedPayload = jwt.decode(token);
  } catch (err) {
    return res.status(400).json(err);
  }

  if (!decodedPayload) {
    return res.status(400).json({ token: 'Token could not be decoded' });
  }

  const { id } = decodedPayload;
  mongoose.model('User').findById(id, (err, user) => {
    if (err) {
      return res.status(400).json({ token: 'Token is invalid', error: err });
    }

    if (!user) {
      return res.status(400).json({ token: 'A user does not exist with that id' });
    }

    const key = keys.jwtKey + user.password;

    try {
      jwt.verify(token, key);
    } catch (err) {
      return res.status(400).json({ token: 'Token is invalid', error: err });
    }

    return res.status(httpCodes.SUCCESS_N0_CONTENT).send();
  });
});

// @route POST api/reset-password/set-password
router.post('/set-password', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ token: 'Token is required' });
  }

  let decodedPayload;

  try {
    decodedPayload = jwt.decode(token);
  } catch (err) {
    return res.status(400).json(err);
  }

  if (!decodedPayload) {
    return res.status(400).json({ token: 'Token could not be decoded' });
  }

  const { id } = decodedPayload;

  const { errors, isValid } = validateRegisterUser(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  mongoose.model('User').findById(id, (err, user) => {
    if (err) {
      return res.status(400).json({ token: 'Token is invalid', error: err });
    }

    if (!user) {
      return res.status(400).json({ token: 'A user does not exist with that id' });
    }

    const key = keys.jwtKey + user.password;

    try {
      jwt.verify(token, key);
    } catch (err) {
      return res.status(400).json({ token: 'Token is invalid', error: err });
    }

    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(400).json(err);
      }

      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          return res.status(400).json(err);
        }

        user.password = hash;
        user
          .save()
          .then((user) => res.json(user))
          .catch((err) => {
            return res.status(400).json(err);
          });
      });
    });
  });
});

module.exports = router;
