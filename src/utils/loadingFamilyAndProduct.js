const { Product, ProductClass, Qualification } = require("../db");
const data = require("../data");

const loadingFamilyAndProduct = async () => {
  // Paso 1: Insertar las ProductClass
  await ProductClass.bulkCreate(
    data.map((familia) => ({
      class: familia.familyName,
      image: familia.familyImage,
    }))
  );
  // Paso 2: Obtener las ProductClass creadas
  const productClasses = await ProductClass.findAll();
  // Paso 2: Asociar los Productos con las ProductClass
  for (const familia of data) {
    const productClass = productClasses.find(
      (pc) => pc.class === familia.familyName
    );

    for (const receta of familia.recipes) {
      const newProduct = await Product.create({
        name: receta.name,
        price: receta.price,
        image: receta.image,
        stock: receta.stock,
        time: receta.time,
        description: receta.desc,
      });
      await newProduct.addProductClasses(productClass.id);

      await Qualification.create({
        id: newProduct.id,
        sum: 0,
        amount: 0,
      });
    }
  }
};

module.exports = loadingFamilyAndProduct;
