const mongodb = require("../DB/connect.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

//chapters: id | Books:_id | Users:_id

//Import Errors
const {
  BadRequest,
  NotFound,
  AuthorizationError,
} = require("../errors");

const register = async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    throw new BadRequest("Missing required fields: userName, email, password");
  }
 
  try { 
    // Create the newUser object using the Mongoose model
    const newUser = new User({
      userName,
      email,
      password,
      type: "user",
    });
    const response = await mongodb
      .getDb()
      .db()
      .collection("users")
      .insertOne(newUser);

      if (response.acknowledged) {
        const token = newUser.createJWT();

        console.log("Created user:", newUser);
        res.status(201).json({ user: { name: newUser.userName }, token });
      } else {
        res.status(500).json({ error: "User not added" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "User not added" });
    }
  };

  const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequest('Please provide credentials');
    }
  
    try {
      const user = await mongodb
        .getDb()
        .db()
        .collection('users')
        .findOne({ email });

        console.log(user);
  
      if (!user) {
        throw new AuthorizationError('User not found or password incorrect');
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new AuthorizationError('User not found or password incorrect');
      }
  
      const token = jwt.sign(
        {
          userID: user._id,
          name: user.userName,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFETIME,
        }
      );
  
      res.status(200).json({ user: { name: user.userName }, token });
      console.log(`Hello ${user.userName}`);
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = { register, login};
