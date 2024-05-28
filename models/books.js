const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  comments: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

BookSchema.methods.getID = function () {
  return this._id;
};

BookSchema.methods.addComment = async function (userID, username, comment) {
  if ((!userID, !username, !comment)) {
    throw new Error("Bad request - missing data");
  }
  this.comments.push({
    userID: userID,
    username: username,
    comment: comment,
  });
  this.save();
  return "saved new comment";
};

BookSchema.methods.deleteComment = async function (userID, commentID) {
  if ((!userID, !commentID)) {
    throw new Error("Bad request - missing data");
  }
  let response = "";
  for (const [index, comment] of this.comments.entries()) {
    if (comment._id == commentID) {
      console.log(`Comment exists at ${index}`);
      if (comment.userID == userID) {
        console.log(`You created this comment`);
        this.comments.splice(index, 1);
        this.save();
        return (response = `deleted`);
      } else {
        console.log("You did not create this comment");
        return (response = `${comment._id} is not a comment you can delete`);
      }
    }
  }
  return response || "Error - comment not found";
};

module.exports = mongoose.model("Book", BookSchema);
