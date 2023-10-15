const { Product, ProductClass, Qualification, ProductsClasses } = require("../db");

const findAllProduct = async () => {
  const product = await Product.findAll({
    where: { deleted: false },
    order: ["id"],
    include: {
      model: ProductClass,
      attributes: ["id", "class", "image", "enable"],
      through: {
        attributes: [],
      },
    },
  });
  return product;
};

const findProduct = async (id) => {
  const productDetail = await Product.findByPk(id);
  return productDetail;
};

const createProduct = async ({
  name,
  price,
  image,
  stock,
  enable,
  productClass,
  description,
  time,
}) => {
  const newProduct = await Product.create({
    name,
    price,
    image,
    stock,
    enable,
    time,
    description,
  });
  await newProduct.addProductClasses(productClass);

  await Qualification.create({
    id: newProduct.id,
    sum: 0,
    amount: 0,
  });

  return newProduct;
};

// ruta para borrar un prod
const destroyProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product.id) {
    return "No hay nada para borrar";
  }
  if (product.deleted) {
    return "Este producto ya estaba borrado";
  }
  Product.update({ deleted: true }, { where: { id: id } });
  return "Producto borrado";
};

const recoverProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product.id) {
    return "Id de producto incorrecto";
  }
  console.log(product.deleted);
  if (product.deleted === false) {
    return "Este producto no esta borrado";
  }
  Product.update({ deleted: false }, { where: { id: id } });
  return "Producto recuperado";
};

const updateProduct = async (id, product) => {
  const productInDb = await Product.findByPk(id);
  await productInDb.setProductClasses([])
  await productInDb.addProductClasses(product.productClass)
  await Product.update(product, { where: { id: id } });
  const updateProduct = Product.findByPk(id);
  return updateProduct;
};
const enableProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product.id) {
    return "Id de producto incorrecto";
  }
  Product.update({ enable: true }, { where: { id: id } });
  return "Producto habilitado";
};

const disableProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product.id) {
    return "Id de producto incorrecto";
  }
  Product.update({ enable: false }, { where: { id: id } });
  return "Producto deshabilitado";
};

const changeProductClass = async (id, newClassId) =>{
  const product = await Product.findByPk(id);
  const newClass = await ProductClass.findByPk(newClassId);

  if (!product || !newClass) {
    return "Producto o clase de producto no encontrados";
  }
  console.log("Ejecutando la función changeProductClass");
  // await product.setProductClasses([]);
  // await product.addProductClass(newClass);
  const productClasses = product.productClasses || [];
  const newProductClass = {
    id: newClass.id,
    class: newClass.class,
    image: newClass.image,
    enable: newClass.enable,
  };

  // Agrega el nuevo objeto de clase de producto al array
  productClasses.push(newProductClass);

  // Asigna el array actualizado a la propiedad productClasses
  product.productClasses = productClasses;

  // Guarda los cambios en la base de datos
  await product.save();

  return "Clase de producto actualizada correctamente";
}

module.exports = {
  createProduct,
  findAllProduct,
  findProduct,
  destroyProduct,
  updateProduct,
  recoverProduct,
  enableProduct,
  disableProduct,
  changeProductClass
};
