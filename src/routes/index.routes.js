const router = require("express").Router();
const userRouter = require("./users.routes");
const projectRouter = require("./projects.routes");

router.use('/users', userRouter);
router.use('/projects', projectRouter);

module.exports = router;