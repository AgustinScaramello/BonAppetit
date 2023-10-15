const { ProductClass, Product } = require("../db");

const findAllProductClasses = async () => {
  const classes = await ProductClass.findAll({
    where: { deleted: false },
    order: ["id"],
    include: {
      model: Product,
      attributes: [
        "id",
        "name",
        "price",
        "image",
        "stock",
        "qualification",
        "time",
        "enable",
        "description",
      ],
      through: {
        attributes: [],
      },
    },
  });
  return classes;
};

//-------------------------------
const productClassArray = [];

const addProductClass = (productClass) => {
  productClassArray.push(productClass);
};
const getProductClass = () => {
  return productClassArray;
};

const initializeProductClassesArray = async () => {
  try {
    const classesFromDatabase = await findAllProductClasses();
    productClassArray.push(...classesFromDatabase);
  } catch (error) {
    console.error(
      "Error al obtener las clases de productos desde la base de datos:",
      error
    );
  }
};

const createProductClass = async (productClass, image) => {
  console.log(image);
  const newClass = await ProductClass.create({
    class: productClass,
    image: image,
  });
  return newClass;
};

//--------------------------------------------------------------------
const destroyProductClass = async (id) => {
  const productClass = await ProductClass.findByPk(id);
  if (!productClass.id) {
    return "No hay nada para borrar";
  }
  if (productClass.deleted) {
    return "Este producto ya estaba borrado";
  }
  ProductClass.update({ deleted: true }, { where: { id: id } });
  return "Producto borrado";
};

const updateProductClass = async (id, productClass) => {
  await ProductClass.update(productClass, { where: { id: id } });
  const updateClass = ProductClass.findByPk(id);
  return updateClass;
};

module.exports = {
  findAllProductClasses,
  createProductClass,
  destroyProductClass,
  updateProductClass,
  addProductClass,
  getProductClass,
  initializeProductClassesArray,
};
