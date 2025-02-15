const express = require('express');
const app = express();

app.use(express.json()); // Para recibir JSON

app.post('/webhooks/orders/create', (req, res) => {
    console.log('📦 ¡Nuevo pedido recibido!', req.body);
    res.sendStatus(200); // Responder con 200 para que Shopify no reintente
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
