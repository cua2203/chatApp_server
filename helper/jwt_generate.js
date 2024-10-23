const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = process.env.SALT;
const expiresIn = process.env.EXPIRES_IN


class JWT_Generate {
  createToken = (_id) => {
    const jwt_token = process.env.SECRET_KEY;
    return (token = jwt.sign({ id: _id }, jwt_token, { expiresIn: expiresIn }));
  };

  hashPassword = (password) => {
    return  bcrypt.hashSync(password, salt);
  };
}
module.exports = new JWT_Generate;