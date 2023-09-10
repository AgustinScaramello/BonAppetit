const mercadopago = require("mercadopago");
const { URL_SUCCESS, URL_FAILURE , URL_NOTIFICATION } = process.env;


// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
	access_token: "TEST-364800963197721-090915-6a620697a31e5836a9edf4a9a6fbbde6-1474242935",
});


const payment = async ( total ) => {



	let preference = {
		items: [
			{
				title: "Bon Appetit",
				unit_price: total,
				quantity: 1,
			}
		],
		back_urls: {
			"success": `${URL_SUCCESS}/success`,
			"failure": `${URL_FAILURE}/error`,
			
		},
		
        //notification_url:`${URL_NOTIFICATION}/order/webhook`,
		auto_return: "approved",
        
	};

	const link  = await mercadopago.preferences.create(preference)

	return link.body.init_point
   
};
const payment_notification =  async ( req, res) => {
	console.log('estoy en notification')
    console.log(req.body)
	if (req.body.action === 'payment.created' && req.body.data) {
		console.log('entro el pago', req.body.data)
	// 	buscar en base de datos el id 
	// 	cambiar estado de created por el nuevo estado de pagado
	// 	cuando se entregue la comida pasara al ultimo estado final, que es delivered.
	}

}

module.exports = {payment , payment_notification}
