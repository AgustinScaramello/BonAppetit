const express = require("express");
const router = express.Router();
const {
  getNotification,
  updateNew,
} = require("../handlers/notificationHandler");

router.get("/", getNotification);
router.put("/:id", updateNew);

module.exports = router;
