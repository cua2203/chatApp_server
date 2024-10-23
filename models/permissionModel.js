const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  action: { type: String, required: true }, // Hành động: 'read', 'write', 'delete'
  resource: { type: String, required: true }, // Tài nguyên: 'post', 'user', 'comment'
});

module.exports = mongoose.model("Permission", PermissionSchema);
