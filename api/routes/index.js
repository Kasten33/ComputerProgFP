const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/books", require("./books"));
router.use("/chapter", require("./chapter"));


module.exports = router;
