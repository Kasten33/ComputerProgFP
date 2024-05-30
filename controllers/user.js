const User = require("../models/user");

//Import Errors
const { BadRequest, NotFound, AuthorizationError } = require("../errors");

const register = async (req, res) => {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("users")
    .insertOne(newUser);
  if (response.acknowledged) {
    console.log("User added to DB");
  } else {
    res.status(500).json({ error: "User not added" });
  }

  if (!newUser.username || !newUser.password) {
    throw new Error("Nope");
  }
  const user = await User.create(newUser);
  if (!user) {
    throw new Error("No User in DB");
  }
  const token = user.createJWT();
  console.log(`Welcome ${newUser.username}`);
  res.json({ user: { name: user.username }, token });
};

const login = async (req, res) => {
  const loginInfo = {
    email: req.body.email,
    password: req.body.password,
  };
  if (!loginInfo) {
    //Recieved incomplete request
    throw new BadRequest("Please provide credentials");
  }
  const user = await User.findOne({ email: loginInfo.email });
  if (!user) {
    //User does not exist
    throw new NotFound("You dont exist");
  }
  const correctPassword = await user.comparePassword(loginInfo.password);
  if (!correctPassword) {
    //Incorrect password
    throw new AuthorizationError("Denied access");
  }
  const token = user.createJWT();
  res.status(200).json({ user: { name: user.username }, token });
  console.log(`Hello ${user.username}`);
};

module.exports = { register, login };
