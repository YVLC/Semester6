const {
  registerNewUser,
  NewAccessToken,
  logoutUser,
  loginUser,
  getotp,
  verifyotp,
  resetpassword,
  updateUser,
} = require("../controllers/user.controller");
const { passport } = require("../config/google_oauth");
const { UserModel } = require("../models/user.model");
const { auth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");



//   const { auth } = require("../middlewares/auth");

const userRouter = require("express").Router();

userRouter.post("/register", registerNewUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", auth, logoutUser);
userRouter.get("/refresh-token", NewAccessToken);
userRouter.post("/getotp", getotp);
userRouter.post("/verifyotp", verifyotp);
userRouter.post("/resetpassword", resetpassword);
userRouter.post("/updateuser", updateUser)

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async function (req, res) {
    const fetch_user = await UserModel.findOne({ email: req.user.email });
    if (fetch_user) {
      token_Genretor(res, fetch_user._id);

      // res.redirect("./../../Frontend/leaderboard.html")
    } else {
      console.log(req.user)
      req.user.password = bcrypt.hashSync(req.user.password, 2);
      // req.user.avatar = fetch_user.avtar;
      const user = new UserModel(req.user);
      await user.save();
      token_Genretor(res, req.user.name, "login with google");
      // res.redirect("./../../Frontend/leaderboard.html")
    }
  }
);

function token_Genretor(res, id) {
  let accessToken = jwt.sign(
    { userId: id },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "24hr" }
  );
  let refreshToken = jwt.sign(
    { userId: id },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "4d" }
  );

  res.cookie("JAA_access_token", accessToken);
  res.cookie("JAA_refresh_token", refreshToken); 
  





// navigate to the "frontend/leaderboard" directory
const targetDirectory = path.join(__dirname,"../../Frontend/lobby.html");
res.set('Content-Type', 'text/html');
res.sendFile(targetDirectory)

}

module.exports = { userRouter };
