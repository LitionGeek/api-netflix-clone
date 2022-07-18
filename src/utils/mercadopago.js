const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token:process.env.ACCESS_MP,
})



module.exports = mercadopago