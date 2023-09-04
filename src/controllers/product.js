const { Product , ProductClass } = require ('../db')

const findallProduct = async (del) => {
    
    const product =  await Product.findAll({
        where: { deleted: del},
        order: ['id'],
        include: {
            model: ProductClass, 
            attributes: ["class"], 
            through: {
                attributes: []
            },
        }
    })
    return product
}



const createProduct = async ({name,price,image,stock,enable,productClass,description}) => {
    console.log(name,price,image,productClass)
    if (!name || !price || !image || productClass )  {  ('faltan datos para crear producto')}
    if ((await ProductClass.findAll()).length<1) { return ('debe cargar clases de comida antes de agregar productos')} 
    const newProduct = await Product.create({
        name,
        price,
        image,
        stock,
        enable,
        description
        })
    newProduct.addProductClasses(productClass)
   
    return newProduct
}
// ruta para borrar un prod
const destroyProduct = async (id) => {
    const product  = await Product.findByPk(id)
    if(!product.id) { return 'no hay nada para borrar'}
    if(product.deleted) { return 'este producto ya estaba borrado'}
    Product.update( { deleted : true} , { where : { id : id}}) 
    return ('producto borrado')
     
}

const recoverProduct = async (id) => {
    const product  = await Product.findByPk(id)

    console.log(product.id)
    if(!product.id) { return 'id de producto incorrecto'}
    if(product.deleted===false) { return 'este producto no esta borrado'}
    Product.update( { deleted : false} , { where : { id : id}}) 
    return ('producto recuperado')
     
}

const updateProduct = async (id,product) => {
    
    await Product.update(product,
        { where: { id: id} }
    )
    const updateProduct =  Product.findByPk(id)
    return updateProduct
}



module.exports = {  createProduct , findallProduct  , destroyProduct , updateProduct , recoverProduct}