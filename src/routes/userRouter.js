const { Router } = require("express");
const { createUser} = require("../controllers/createUser");
const { changePasswordUser } = require("../handlers/handlerCreateUser");
const getUserById = require("../controllers/getUserById");
const getAllUsers = require("../controllers/getAllUsers");
const changeTypeUser = require("../controllers/changeTypeUser");
const getAllUsersAdmins = require("../controllers/getAllUsersAdmins.js");
const getAllUsersClients = require("../controllers/getAllUsersClients.js");
const {disableUser} = require("../controllers/disableUser");

const userRouter = Router();

userRouter.get("/clients", getAllUsersClients);
userRouter.get("/admins", getAllUsersAdmins);
userRouter.get("/:id", getUserById);
userRouter.get("/", getAllUsers);
userRouter.post("/create", createUser);

userRouter.put("/disableUser/:uid", disableUser);

userRouter.put("/put", changePasswordUser);
userRouter.put("/update", changeTypeUser);

module.exports = userRouter;
