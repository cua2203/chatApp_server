const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    role_name: { type: String, required: true, unique: true },
    permissions: [
      {
        action: { type: String, required: true }, // Ví dụ: 'read', 'write', 'delete'
        resource: { type: String, required: true }, // Ví dụ: 'post', 'comment', 'user'
      },
    ],
  },
  {
    timestamps: true,
  }
);

const roleModel = mongoose.model("Role", roleSchema);

module.exports = roleModel;
