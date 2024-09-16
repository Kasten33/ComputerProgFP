const mongodb = require("../DB/connect.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
//chapters: id | Books:_id | Users:_id

//Import Errors
const { BadRequest, AuthorizationError } = require("../errors");

const register = async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    throw new BadRequest("Missing required fields: userName, email, password");
  }

  try {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword, // Store the hashed password
      type: "user",
      books: [],
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("users")
      .insertOne(newUser);

    if (response.acknowledged) {
      const token = jwt.sign(
        {
          userID: newUser._id,
          name: newUser.userName,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFETIME,
        }
      );

      console.log("Created user:", newUser);
      res.status(201).json({ user: { name: newUser.userName }, token });
    } else {
      res.status(500).json({ error: "User not added" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "User not added" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please provide credentials");
  }

  try {
    const user = await mongodb
      .getDb()
      .db()
      .collection("users")
      .findOne({ email });

    if (!user) {
      throw new AuthorizationError("User not found or password incorrect");
    }

    //console.log("User object:", user);
    //console.log("Provided password:", password);
    //console.log("Stored password:", user.password);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AuthorizationError("User not found or password incorrect");
    }

    // Generate JWT token
    const token = jwt.sign({ userID: user._id.toString(), name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //console.log('Generated Token:', token);

    // Add the token to the user's tokens array
    await mongodb.getDb().db().collection('users').updateOne(
      { _id: user._id },
      { $push: { tokens: { token } } }
    );

    res.status(200).json({ user: { name: user.userName }, token });
    console.log(`Hello ${user.userName}`);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    // Get the user ID from the URL parameters
    const userId = req.params.userId;

    // Validate the user ID
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find the user by ID
    const user = await mongodb.getDb().db().collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the userName
    res.json({ userName: user.userName, email: user.email, books: user.books });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { register, login, getUser };
