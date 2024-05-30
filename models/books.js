const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
});

BookSchema.methods.getID = function () {
  return this._id;
};

module.exports = mongoose.model("Book", BookSchema);
