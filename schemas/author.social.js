const { Schema, model } = require("mongoose");

const authorSocialSchema = new Schema(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      default: null,
    },
    social_id: {
      type: Schema.Types.ObjectId,
      ref: "Social",
      default: null,
    },
    social_link: {
      type: String,
      trim: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Author_Social", authorSocialSchema);
