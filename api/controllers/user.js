const mongodb = require("../DB/connect.js");
const User = require("../../api/models/user.js");

//Import Errors
const {
  BadRequest,
  NotFound,
  AuthorizationError,
} = require("../../api/errors");

const test = (req, res) => {
  res.status(200).json({ message: "Hello" });
};

const register = async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    throw new BadRequest("Missing required fields: userName, email, password");
  }
 
  try { 
    const newUser = {
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    type: "user",
  };
    const response = await mongodb
      .getDb()
      .db()
      .collection("users")
      .insertOne(newUser);

      if (response.acknowledged) {
        res.status(201).json(response);
      } else {

    console.log("Created user:", newUser);
    const token = newUser.createJWT();
      }
    // Generate a JWT for the user
  
    console.log(`Welcome ${newUser.userName}`);
    res.status(201).json({ user: { name: newUser.userName }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User not added" });
  }
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
  res.status(200).json({ user: { name: user.userName }, token });
  console.log(`Hello ${user.userName}`);
};

module.exports = { register, login, test };
