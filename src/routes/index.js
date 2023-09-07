const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const registerRouter = require("./registerRouter");
const userRouter = require("./userRouter");
const productClassRouter = require("./productClassRouter");
const productRouter = require("./productRouter");
const authRouter = require ("./authRouter")

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/users", userRouter);

router.use("/productClass", productClassRouter);
router.use("/product", productRouter);
router.use("/auth", authRouter)
router.use("/register", registerRouter)

module.exports = router;
