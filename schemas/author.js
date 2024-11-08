const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    nick_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Iltimos email adresni to'g'ri kiriting!",
      ],
    },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value);
        },
        message: (props) => `${props.value}-Telefon raqamni to'g'ri kiriting`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [4, "Parol juda qisqa"],
    },
    info: {
      type: String,
      maxlength: 2000,
    },
    position: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: "default_photo.jpg",
    },
    is_expert: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
    },
    activation_link: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Author", authorSchema);
