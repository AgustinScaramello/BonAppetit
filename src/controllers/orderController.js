const { Product, OrderDetail, Order } = require("../db");

//-----------------------------------------------------------------------------------------

const createOrder = async (arrOrderDetail, idUser) => {
  let totalPrice = 0;

  await arrOrderDetail.map((product) => {
    totalPrice += product.price * product.amount;
  });

  const newOrder = await Order.create({ total: totalPrice, UserId: idUser });

  await arrOrderDetail.forEach(async (product) => {
    const productExists = await Product.findByPk(product.idProduct);

    if (productExists) {
      await OrderDetail.create({
        ProductId: product.idProduct,
        price: product.price,
        amount: product.amount,
        extras: product.extras,
        OrderId: newOrder.id,
      });
    }
  });

  const order = await Order.findByPk(newOrder.id, {
    include: {
      model: OrderDetail,
      include: [Product],
    },
  });

  return order;
};

//-----------------------------------------------------------------------------------------

const filterOrder = async (filterBy) => {
  let where = {};

  if (filterBy.userId) {
    where.UserId = filterBy.userId;
  }

  if (filterBy.status) {
    where.status = filterBy.status;
  }

  if (filterBy.payment_status) {
    where.payment_status = filterBy.payment_status;
  }

  const filteredProducts = await Order.findAll({
    where: where,
    include: {
      model: OrderDetail,
      include: [Product],
    },
  });

  return filteredProducts;
};

//-----------------------------------------------------------------------------------------

const orderPaid = async (id) => {
  await Order.update(
    { payment_status: true, status: "En_preparacion" },
    { where: { id: id } }
  );
  const order = await Order.findByPk(id, {
    include: {
      model: OrderDetail,
      include: [Product],
    },
  });

  await order.OrderDetails.forEach(async (detail) => {
    await Product.decrement("stock", {
      by: detail.amount,
      where: { id: detail.id },
    });

    const product = await Product.findByPk(detail.id);

    if (product.stock === 0) {
      await Product.update({ enable: false }, { where: { id: detail.id } });
    }
  });

  return order;
};

//-----------------------------------------------------------------------------------------

const changeStatus = async (id, status) => {
  await Order.update({ status: status }, { where: { id: id } });
  const order = await Order.findByPk(id, {
    include: {
      model: OrderDetail,
      include: [Product],
    },
  });
  return order;
};

//-----------------------------------------------------------------------------------------

const removeOrder = async (id) => {
  return await Order.destroy({
    where: {
      id: id,
    },
  });
};

//-----------------------------------------------------------------------------------------

const findOrderById = async(orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    return order;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOrder,
  filterOrder,
  orderPaid,
  changeStatus,
  removeOrder,
  findOrderById,
};