const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Validator = require('validator');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      validate: {
        validator: Validator.isEmail,
        message: 'Email is invalid',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      hide: true,
    },
    accessLevel: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
      required: [true, 'Access Level is required'],
    },
  },
  { timestamps: true }
);

userSchema.plugin(require('./plugins/duplicateError'), { email: 'Email already exists' });
userSchema.plugin(require('mongoose-hidden')({ defaultHidden: { _id: false } }));

module.exports = userSchema;
