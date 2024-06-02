const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
});
const Book =
  mongoose.models && mongoose.models.Book
    ? mongoose.models.Book
    : mongoose.model("Book", BookSchema);
module.exports = Book;
