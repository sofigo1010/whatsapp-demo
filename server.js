const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json()); // Permite recibir JSON en el webhook

// Ruta del Webhook de Shopify
app.post('/webhooks/orders/create', async (req, res) => {
    try {
        const order = req.body;

        // Obtener número de teléfono
        const customerPhone = order.customer?.phone || order.shipping_address?.phone;
        const customerName = order.customer?.first_name || "Cliente";
        const orderId = order.id;

        console.log(`📦 ¡Nuevo pedido recibido de ${customerName}! Teléfono: ${customerPhone}`);

        if (!customerPhone) {
            console.log("❌ No hay número de teléfono en la orden.");
            return res.sendStatus(403);
        }

        // Construcción del mensaje para WhatsApp
        const data = {
            "messaging_product": "whatsapp",
            "to": customerPhone,
            "type": "template",
            "template": {
                "name": "confirmacion_pedido",
                "language": { "code": "es_LA" },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            { "type": "text", "text": customerName },
                            { "type": "text", "text": orderId.toString() }
                        ]
                    }
                ]
            }
        };

        const config = {
            headers: { 
                Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        // Enviar mensaje de WhatsApp
        const response = await axios.post(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_ID}/messages`,
            data,
            config
        );

        console.log("✅ Mensaje enviado con éxito:", response.data);
        return res.sendStatus(200);
        
    } catch (error) {
        console.error("❌ Error enviando mensaje de WhatsApp:", error.response?.data || error.message);
        return res.sendStatus(500);
    }
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
