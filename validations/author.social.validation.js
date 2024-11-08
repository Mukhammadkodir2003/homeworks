const Joi = require("joi");

exports.authorSocialValidation = (data) => {
  const schemaAuthorSocial = Joi.object({
    author_id: Joi.string(),
    social_id: Joi.string(),
    social_link: Joi.string(),
  });
  return schemaAuthorSocial.validate(data, { abortEarly: false });
};
