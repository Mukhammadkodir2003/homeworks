const Joi = require("joi");

exports.categoryValidation = (data) => {
  const schemaCategory = Joi.object({
    category_name: Joi.string()
      .min(2)
      .message("Kategoriya nomi 2ta harfdan ko'p bo'lishi kerak")
      .max(100)
      .required()
      .messages({
        "string.empty": "Kategoriya nomi bo'sh bo'lishi mumkin emas",
        "any.required": "Kategoriya nomini albatta kiritish shart!",
      }),
    parent_category_id: Joi.string().alphanum().message("Id noto'g'ri"),
  });

  return schemaCategory.validate(data, { abortEarly: false });
};
