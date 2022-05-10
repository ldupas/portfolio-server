const router = require("express").Router();
const userRouter = require("./users.routes");

router.use('/users', userRouter);

module.exports = router;