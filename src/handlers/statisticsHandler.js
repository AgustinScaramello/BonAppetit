const {
    totalSale, 
    totalSaleDetails,
    salesRanking
  } = require("../controllers/statisticsController");
  


  const sales = async (req, res) => {
    try {
      const { since , until } = req.query  
      const sales = await totalSale(since,until);
      res.status(200).json(`las ventas totales del periodo desde: ${since} hasta ${until} fueron de $ ${sales}`);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const salesDetails = async (req, res) => {
    try {
        const { since , until } = req.query  
        const salesDetails = await totalSaleDetails(since,until);
        res.status(200).json(salesDetails);
    }catch (error) {
        res.status(400).json({ error: error.message });
    }
  };
 
  const productRanking = async (req, res) => {
    try {
        const { since , until } = req.query 
        const salesDetails = await salesRanking(since, until);
        res.status(200).json(salesDetails);
    }catch (error) {
        res.status(400).json({ error: error.message });
    }
  };
  
  module.exports = {
    sales,
    salesDetails,
    productRanking
  };
  