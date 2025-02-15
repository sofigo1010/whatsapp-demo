const express = require('express');
const app = express();

app.use(express.json()); // Para recibir datos en JSON

app.post('/webhooks/orders/create', (req, res) => {
    console.log('📦 ¡Nuevo pedido recibido!', req.body);
    res.sendStatus(200); // Responde a Shopify para confirmar la recepción
});

app.listen(3000, () => console.log('🚀 Servidor corriendo en el puerto 3000'));
