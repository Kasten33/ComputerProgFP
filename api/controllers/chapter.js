const mongodb = require("../DB/connect");
const { ObjectId } = require("mongodb");

const addChapter = async (req, res) => {
    const bookId = req.params.bookId;

    try {
        const chapter = {
            _id: new ObjectId(),
            chapTitle: req.body.chapTitle,
            content: req.body.content,
        }
        const response = await mongodb
        .getDb()
        .db()
        .collection("books")
        .updateOne(
            { _id: new ObjectId(bookId) },
            {$push: {chapters: chapter} })
          
  
      if (response.acknowledged) {
        res.status(201).json(response)
        console.log("Chapter added successfully.");
      } else {
        console.log(bookId)
        console.log(chapter)
        console.log("Failed to add chapter.");
      }
    } catch (error) {
      console.error("Error adding chapter to book:", error);
    }
};

const updateChapter = async (req, res) => {
    const bookId = req.params.bookId;
    const chapterId = req.params.id;
    const chapter = req.body;
  
    try {
      const db = await mongodb.getDb();
      const result = await db.collection("books").updateOne(
        { _id: new ObjectId(bookId), "chapters._id": new ObjectId(chapterId) },
        { $set: { "chapters.$": chapter } }
      );
  
      if (result.modifiedCount === 1) {
        console.log("Chapter updated successfully.");
      } else {
        console.log("Failed to update chapter.");
      }
    } catch (error) {
      console.error("Error updating chapter:", error);
    }
};

const deleteChapter = async (req, res) => {
    const bookId = req.params.bookId;
    const chapterId = req.params.id;
    try{
        const db = await mongodb.getDb();
        const result = await db.collection("books").updateOne(
            { _id: new ObjectId(bookId) },
            { $pull: { chapters: { _id: new ObjectId(chapterId) } } }
        );
        if (result.modifiedCount === 1) {
            console.log("Chapter deleted successfully.");
          } else {
            console.log("Failed to delete chapter.");
          }
    } catch (error) {
    console.error("Error deleting chapter:", error);
}
};

const getAllChapters = async (req, res) => {
    const bookId = req.params.bookId;
    try {
      const db = await mongodb.getDb();
      const book = await db.collection("books").findOne({ _id: new ObjectId(bookId) });
      res.status(200).json(book.chapters);
    } catch (error) {
      console.error("Error getting all chapters:", error);
      res.status(500).json(error);
    }
};

const getOneChapter = async (req, res) => {
    const bookId = req.params.bookId;
    const chapterId = req.params.id;
    try {
      const db = await mongodb.getDb();
      const book = await db.collection("books").findOne({ _id: new ObjectId(bookId) });
      const chapter = book.chapters.find((c) => c._id.toString() === chapterId);
      res.status(200).json(chapter);
    } catch (error) {
      console.error("Error getting one chapter:", error);
      res.status(500).json(error);
    }
};

    module.exports = {addChapter, updateChapter,
        deleteChapter, getAllChapters, getOneChapter};
    