const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const registerRouter = require("./registerRouter");
const userRouter = require("./userRouter");
const productClassRouter = require("./productClassRouter");
const productRouter = require("./productRouter");
const authRouter = require("./authRouter");
const orderRouter = require("./orderRouter");
const qualificationRouter = require("./qualificationRouter");
const statisticsRouter = require("./statisticsRouter.js");
const notificationRouter = require("./notificationRouter");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/users", userRouter);

router.use("/productClass", productClassRouter);
router.use("/product", productRouter);
router.use("/auth", authRouter);
router.use("/register", registerRouter);
router.use("/order", orderRouter);
router.use("/qualification", qualificationRouter);
router.use("/statistics", statisticsRouter);
router.use("/notification", notificationRouter);

router.use((req, res) => {
  // caso en que se ponga una url distinta a la solicitada (residual)
  res.status(404).send("dirección no encontrada");
});

module.exports = router;
