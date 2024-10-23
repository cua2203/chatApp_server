const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routers/index.router");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModel = require("./models/userModel");


require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:4200', // URL frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Các phương thức được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các headers được phép
  credentials: true, // Cho phép cookie trong yêu cầu
};

app.use(cors(corsOptions));
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/v1/api", router);

// Cấu hình Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Có thể lưu trữ thông tin người dùng vào database tại đây

      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Định tuyến để xử lý xác thực Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
 async function (req, res) {
    const token = jwt.sign(
      {
        email: req.user.emails[0].value,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    let user =await userModel.findOne({ email: req.user.emails[0].value});
    console.log('check: ',req.user.emails[0].value);
    if (!user) {
      user = new userModel({
        name: req.user.displayName,
        email: req.user.emails[0].value,
      });
     await user.save();
    }

    // Gửi token dưới dạng HTTP-only cookie
    res.cookie("jwt_token", token, {
      httpOnly: true,
 //   secure: process.env.NODE_ENV === "production", // Chỉ dùng cho môi trư��ng production
      sameSite: "Strict",
    });
    res.redirect("http://localhost:4200/");
  }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error(err));
