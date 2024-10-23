const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 256,
      default: "Abc@12345",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        default: ["6710bb278767dd17aaac93d2"],
      },
    ],
    phone: {
      type: String,
      minlength: 10,
      maxlength: 10,
      default: "0364141625",
    },

    thumnail: {
      type: String,
      default:
        "https://asset.cloudinary.com/dfxdbjunk/ccbd49f56d564f19b5f70940b77d000b", // URL hình ảnh placeholder cho user
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
