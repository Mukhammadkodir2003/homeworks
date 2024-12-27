const { Schema, model } = require("mongoose");

const authorSchema = new Schema({
  author_first_name: {
    type: String,
    required: true,
    trim: true,
  },
  author_last_name: {
    type: String,
    required: true,
    trim: true,
  },
  author_nick_name: {
    type: String,
    minlength: 3,
    maxlength: 20
  },
  author_email: {
    type: String,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
      "Iltimos, emailni to'g'ri kiriting",
    ],
  },
  author_phone: {
    type: String,
  },
  author_password: {
    type: String,
  },
  author_info: {
    type: String, maxlength: [150, "Qisqaroq info kerak"]
  },
  author_position: {
    type: String
  },
  author_photo: {
    type: String
  },
  is_expert: {
    type: Boolean,
    default: false
  },
  author_is_active: {
    type: Boolean,
    default: true
  },
  refresh_token: String,
  activation_link : String
});

module.exports = model("Author", authorSchema);
