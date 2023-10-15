const {
  Product,
  OrderDetail,
  Order,
  User,
  Notification,
  ProductClass,
} = require("../db");
const { payment } = require("./paymentController");
const { URL_QUALIFICATION } = process.env;
const { sendEmail } = require("../config/sendGridConfig");
const {qualificationEmail} = require("../utils/msgHTMLEmailConfirm")

//-----------------------------------------------------------------------------------------

const create = async (arrOrderDetail, idUser, take_away, notes) => {
  let totalPrice = 0;
  let maxTime = 0;

  for (const product of arrOrderDetail) {
    const productExists = await Product.findByPk(product.idProduct);
    totalPrice += (await productExists.price) * product.amount;
    if (productExists.time > maxTime) {
      maxTime = await productExists.time;
    }
  }

  const newOrder = await Order.create({
    total: totalPrice,
    time: maxTime,
    UserId: idUser,
    take_away: take_away,
    notes: notes,
  });

  for (const product of arrOrderDetail) {
    const productExists = await Product.findByPk(product.idProduct);

    if (productExists) {
      await OrderDetail.create({
        ProductId: product.idProduct,
        price: productExists.price,
        amount: product.amount,
        OrderId: newOrder.id,
      });
    }
  }

  const order = await Order.findByPk(newOrder.id, {
    include: {
      model: OrderDetail,
      include: [Product],
    },
  });

  return order;
};

const createOrder = async (
  arrOrderDetail,
  idUser,
  status,
  take_away,
  notes
) => {
  if (status === "Mercado_Pago") {
    const order = await create(arrOrderDetail, idUser, take_away, notes);
    const link = await payment(order.total, order.id);
    return { order, link };
  }

  const order = await create(arrOrderDetail, idUser);

  return order;
};

//-----------------------------------------------------------------------------------------

const findAllOrders = async () => {
  const allOrders = await Order.findAll({
    include: {
      model: OrderDetail,
      include: [Product],
    },
  });

  return allOrders;
};

//-----------------------------------------------------------------------------------------

const filterOrder = async (filterBy) => {
  let where = {};

  if (filterBy.userId) {
    where.UserId = filterBy.userId;
  }

  if (filterBy.userMail) {
    const user = await User.findOne({ where: { email: filterBy.userMail } });
    where.UserId = user.id;
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
  const paidOrder = await Order.findByPk(id);

  if (paidOrder.payment_status === false) {
    await Order.update(
      { payment_status: true, status: "ongoing" },
      { where: { id: id } }
    );
    const order = await Order.findByPk(id, {
      include: {
        model: OrderDetail,
        include: [Product],
      },
    });

    for (const detail of order.OrderDetails) {
      await Product.decrement("stock", {
        by: detail.amount,
        where: { id: detail.ProductId },
      });

      const product = await Product.findByPk(detail.ProductId, {
        include: {
          model: ProductClass,
          attributes: ["class"],
          through: {
            attributes: [],
          },
        },
      });

      const { name, stock, ProductClasses } = product;

      if (stock < 6 && stock > 0) {
        const stockMin = `Te queda poco stock de ${name} de la familia ${ProductClasses[0].class}. Stock: ${stock}`;
        await Notification.create({
          message: stockMin,
          idProduct: detail.ProductId,
        });
      }

      if (stock < 1) {
        await Product.update(
          { enable: false },
          { where: { id: detail.ProductId } }
        );

        const stockMin = `No hay stock de ${name} de la familia ${ProductClasses[0].class}. El producto se deshabilito para su venta`;
        await Notification.create({
          message: stockMin,
          idProduct: detail.ProductId,
        });
      }
    }
    await sendMsg(order.UserId, order.id);
    return order;
  } else {
    const message = "La orden ya esta pagada";
    return message;
  }
};

//-----------------------------------------------------------------------------------------

const sendMsg = async (userId, orderId) => {
  const user = await User.findOne({ where: { id: userId } });

  const msg = {
    to: `${user.email}`,
    from: `noreply.bonapptit@gmail.com`, // Use the email address or domain you verified above
    subject: "¡Queremos conocer tu opinión sobre lo que compraste!",
    html: qualificationEmail(`${URL_QUALIFICATION}/${orderId}`, user.displayName),
  };

  sendEmail(msg)
    .then((response) => console.log("mensaje enviado"))
    .catch((error) => console.log(error));
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
  await OrderDetail.destroy({
    where: {
      OrderId: id,
    },
  });
  await Order.destroy({
    where: {
      id: id,
    },
  });
};

//-----------------------------------------------------------------------------------------

const findOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: {
      model: OrderDetail,
      include: [Product],
    },
  });
  return order;
};

module.exports = {
  createOrder,
  filterOrder,
  orderPaid,
  changeStatus,
  removeOrder,
  findOrderById,
  findAllOrders,
};
