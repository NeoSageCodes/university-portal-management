const joi = require("joi");

const createDepartmentValidation = (req, res, next) => {
  const schema = joi
    .object({
      name: joi.string().trim().required().messages({
        "any.required": "Department name is required.",
        "string.base": "Department name must be text.",
        "string.empty": "Department name cannot be empty.",
        "string.trim": "Department name cannot start or end with spaces.",
      }),
      faculty: joi.string().trim().required().messages({
        "any.required": "Faculty is required.",
        "string.base": "Faculty must be text.",
        "string.empty": "Faculty cannot be empty.",
        "string.trim": "Faculty cannot start or end with spaces.",
      }),
    })
    .messages({
      "object.unknown": "Only name and faculty are allowed.",
    });

  const { error } = schema.validate(req.body, { convert: false });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

const createCourseValidation = (req, res, next) => {
  const schema = joi
    .object({
      courseCode: joi.string().trim().required().messages({
        "any.required": "Course code is required.",
        "string.base": "Course code must be text.",
        "string.empty": "Course code cannot be empty.",
        "string.trim": "Course code cannot start or end with spaces.",
      }),
      title: joi.string().trim().required().messages({
        "any.required": "Course title is required.",
        "string.base": "Course title must be text.",
        "string.empty": "Course title cannot be empty.",
        "string.trim": "Course title cannot start or end with spaces.",
      }),
      creditUnits: joi.number().integer().positive().required().messages({
        "any.required": "Credit units is required.",
        "number.base": "Credit units must be a number.",
        "number.integer": "Credit units must be a whole number.",
        "number.positive": "Credit units must be greater than zero.",
      }),
      department: joi.string().trim().required().messages({
        "any.required": "Department name is required.",
        "string.base": "Department name must be text.",
        "string.empty": "Department name cannot be empty.",
        "string.trim": "Department name cannot start or end with spaces.",
      }),
    })
    .messages({
      "object.unknown":
        "Only courseCode, title, creditUnits and department are allowed.",
    });

  const { error } = schema.validate(req.body, { convert: false });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  createDepartmentValidation,
  createCourseValidation,
};
