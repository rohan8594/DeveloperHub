const Validator = require("validator");

const isEmpty = require("./is-empty");

const validateEducationInput = data => {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.major = !isEmpty(data.major) ? data.major : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "School field cannot be empty";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree field cannot be empty";
  }

  if (Validator.isEmpty(data.major)) {
    errors.major = "Major field cannot be empty";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field cannot be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateEducationInput;
