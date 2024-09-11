const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const { login, register, getUser} = require("../controllers/user.js");

router.post("/login", login);
router.post("/register", register);
router.get("/:userId", getUser);

router.use("/books", auth, require("./books"));

module.exports = router;
