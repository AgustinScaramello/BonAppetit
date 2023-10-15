const express = require("express");
const router = express.Router();
const {
  postQualification,
  getQualification,
} = require("../handlers/qualificationHandler");

router.post("/", postQualification);

router.get("/:id", getQualification);

module.exports = router;
