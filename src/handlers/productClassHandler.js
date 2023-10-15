const {
  createProductClass,
  findAllProductClasses,
  destroyProductClass,
  updateProductClass,
  addProductClass,
  getProductClass,
} = require("../controllers/productClassController.js");
const { ProductClass } = require("../db");

// handler que trae todos las clases de productos
const getAllProductClasses = async (req, res) => {
  try {
    const productClass = await findAllProductClasses();
    res.status(200).json(productClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// handler para crear una clases de producto
const postProductClass = async (req, res) => {
  try {
    const { productClass, image } = req.body;
    // console.log(productClass, image);
    const newClass = await createProductClass(productClass, image); // Crea la nueva clase de producto como un objeto
    addProductClass(newClass); // Agrega la nueva clase al array global
    const updatedClasses = getProductClass(); // Devuelve el array de clases de productos actualizado
    res.status(201).json(updatedClasses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// handler para borrar una clase de producto
const deleteProductClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteClass = await destroyProductClass(id);
    res.status(201).send(deleteClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// handler para actualizar clase de Producto
const putProductClass = async (req, res) => {
  try {
    const { id } = req.params;
    const productClass = req.body;
    const updateClass = await updateProductClass(id, productClass);
    res.status(201).send(updateClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const putUpdateProductClass = async (req, res) =>{
  try {
    const { updatedArray } = req.body;
    for (const updatedObject of updatedArray) {
      if (!updatedObject.id) {
        //console.log("class", updatedObject.class);
        await ProductClass.create(updatedObject);
      } else {
        console.log("class", updatedObject.class);
        await ProductClass.update(
          {
            class: updatedObject.class,
            image: updatedObject.image,
            enable: updatedObject.enable,
          },
          {
            where: { id: updatedObject.id },
          }
        );
      }
    }
    
    let productClassArray = await ProductClass.findAll();
    const responseArray = productClassArray.map((item) => ({
      ...item.toJSON(),
      Products: [],
    }));
    res.status(200).json(responseArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProductClasses,
  postProductClass,
  deleteProductClass,
  putProductClass,
  putUpdateProductClass
};
