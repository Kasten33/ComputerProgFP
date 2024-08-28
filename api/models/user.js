require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function () {
  if (this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.methods.getID = function () {
  return this._id;
};

UserSchema.methods.getName = function () {
  return this.username;
};

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userID: this._id,
      name: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
UserSchema.methods.comparePassword = async function (canidatePassword) {
  const isMatch = await bcrypt.compare(canidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
