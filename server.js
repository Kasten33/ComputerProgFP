const express = require("express");
const mongodb = require("./DB/connect");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;

app
  .use(cors())
  .use(express.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/", require("./routes"));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  }
});
