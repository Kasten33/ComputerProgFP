const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
  _id : { type: Schema.Types.ObjectId, auto: true },
  chapTitle: { type: String, required: true },
  content: { type: String, required: true },
});

const BookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, required: true },
  chapters: { type: [ChapterSchema], required: false },
  type: { type: String, required: true },
});
const Book =
  mongoose.models && mongoose.models.Book
    ? mongoose.models.Book
    : mongoose.model("Books", BookSchema);
module.exports = Book;
