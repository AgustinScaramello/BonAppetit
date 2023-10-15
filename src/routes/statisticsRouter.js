const express = require("express");
const router = express.Router();

const {
  sales,
  salesDetails,
  productRanking

} = require("../handlers/statisticsHandler");

router.get("/sales", sales);

router.get("/salesDetails" , salesDetails)

router.get("/ranking" , productRanking)

module.exports = router;
