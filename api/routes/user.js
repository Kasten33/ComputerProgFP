const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const { login, register, test } = require("../controllers/user.js");

router.post("/login", login);
router.post("/register", register);
router.get("/test", test);

router.use("/books", auth, require("./books"));

module.exports = router;
