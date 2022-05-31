const router = require("express").Router();
const userRouter = require("./users.routes");
const projectRouter = require("./projects.routes");
const categoryRouter = require("./categories.routes");
const languageRouter = require("./languages.routes");
const skillRouter = require("./skills.routes");

router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/categories', categoryRouter);
router.use('/languages', languageRouter);
router.use('/skills', skillRouter);

module.exports = router;