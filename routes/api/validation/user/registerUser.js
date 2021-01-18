const Validator = require('validator');
const isEmpty = require('is-empty');

const MIN_PASSWORD_LENGTH = 6;

function validatePassword(password, paramName = 'Password') {
  if (!password) {
    return `${paramName} is required`;
  }
  if (!Validator.isLength(password, { min: 6 })) {
    return `${paramName} must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

module.exports = {
  validatePassword,

  validateRegisterUser(user) {
    let errors = {};

    const passwordErrors = validatePassword(user.password);
    if (passwordErrors) {
      errors.password = passwordErrors;
    }

    if (!user.password2) {
      errors.password2 = 'Confirm password is required';
    }

    if (user.password !== user.password2) {
      errors.password2 = 'Passwords must match';
    }

    return {
      errors,
      isValid: isEmpty(errors),
    };
  },
};
