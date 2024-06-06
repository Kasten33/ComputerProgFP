const express = require("express");
const mongodb = require("./api/DB/connect.js");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app
  .use(cors())
  .use(express.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/", require("./api/routes/index.js"));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  }
});
