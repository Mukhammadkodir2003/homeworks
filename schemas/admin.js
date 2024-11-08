const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      minlength: [4, "Parol juda qisqa"],
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    is_creator: {
      type: Boolean,
      default: false,
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
    updated_date: {
      type: Date,
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

module.exports = model("Admin", adminSchema);
