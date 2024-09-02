const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, required: true },
  chapters: { type: Array, required: false },
});
const Book =
  mongoose.models && mongoose.models.Book
    ? mongoose.models.Book
    : mongoose.model("Books", BookSchema);
module.exports = Book;
