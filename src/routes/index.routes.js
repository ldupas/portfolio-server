const router = require("express").Router();
const userRouter = require("./users.routes");
const projectRouter = require("./projects.routes");
const categoryRouter = require("./categories.routes");
const languageRouter = require("./languages.routes");

router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/categories', categoryRouter);
router.use('/languages', languageRouter);

module.exports = router;