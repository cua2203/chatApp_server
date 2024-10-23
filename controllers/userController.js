const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (email) => {
  const jwt_token = process.env.SECRET_KEY;
  return (token = jwt.sign({ email: email }, jwt_token, { expiresIn: "1h" }));
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: "all fields are required ..." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be a strong password" });
    }

    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = createToken(user.email);

    res.status(200).json({ _id: user._id, token, name, email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
 
    if (!user) {
      return res.status(401).json({rs:0, message: "email or password is invalid" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({rs:0, message: "email or password is invalid" });
    }
    const token = createToken(user.email);

    res.cookie("jwt_token", token, {
      httpOnly: true,
 //   secure: process.env.NODE_ENV === "production", // Chỉ dùng cho môi trư��ng production
      sameSite: "Strict",
    });
    res.json({token: token,email:user.email,name:user.name, message:"success"})

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const findUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    user.password = null;
    if (!user) {
      return res.status(404).json({ rs: 0, message: "User not found" });
    }
    res.status(200).json({ rs: 1, message: "success", user: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ rs: 0, message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ rs: 1, message: "success", users: users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ rs: 0, message: "Internal server error" });
  }
};

const getUserPermission = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).populate("roles");
    const roleNames = user.roles.map((role) => role.role_name);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "success", user: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const checkAuthenticated = async (req, res) => {
  try {
    const token = req.cookies.jwt_token;
    if (!token) {
      return res.status(401).json({ rs: 0, message: "User not authenticated" });
    }
    const data = jwt.verify(token, process.env.SECRET_KEY);
    let email = data.email;
  
    const user = await userModel.findOne({email});

    if (!user) {
      return res.status(401).json({ rs: 0, message: "User not authenticated" });
    }
    res.status(200).json({ rs: 1, message: "User authenticated", user: user });
  }catch(err){
    console.log(err);
    return res.status(500).json({ rs: 0, message: "Internal server error" });
  }
}

const logOut = (req, res) => {
  res.clearCookie("jwt_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use secure in production
    sameSite: "Strict",
  });

  res.status(200).json({rs:1, message: "Successfully logged out" });
}

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUser,
  getUserPermission,
  checkAuthenticated,
  logOut,
};
