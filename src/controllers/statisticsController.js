const { Product,  Order , OrderDetail} = require("../db");
const { Op } = require("sequelize");
const { Sequelize } = require ("sequelize")

const totalSale = async (since,until) => {
  const totalSale = await Order.sum('total',{
    where: {
        createdAt: {
            [Op.between]: 
            [`${since}T00:00:00.307Z`, `${until}T23:59:59.307Z`]
        },
        payment_status: true
    }
  })
  return totalSale;
};

const totalSaleDetails = async (since,until) => {
    const totalSaleDetails = await Order.findAll({
      where: {
          createdAt: {
              [Op.between]: 
              [`${since}T00:00:00.307Z`, `${until}T23:59:59.307Z`]
          },
          payment_status: true

        },
        include: {
            model: OrderDetail,
            include: [Product],
          },
    })
    return totalSaleDetails;
};

const salesRanking = async (since , until) => { 

    const ranking = await OrderDetail.findAll({
        attributes: [
        "ProductId", 
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount'],
        ],
        group: ['ProductId',"Product.id"],
        order: [['total_amount',"DESC"]],
        include: [{
            model: Product,
            attributes: ["name"],
        },
        {
            model: Order,
            
            where: {
                createdAt: {
                    [Op.between]: 
                    [`${since}T00:00:00.307Z`, `${until}T23:59:59.307Z`]
                },
                payment_status: true
      
              },
            attributes: []
        },
    ],
    });
    return ranking
}



module.exports = {
  totalSale, 
  totalSaleDetails,
  salesRanking

};
