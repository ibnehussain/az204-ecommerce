const { v4: uuidv4 } = require('uuid');

/**
 * OrderProcessor - Azure Function
 * 
 * HTTP-triggered function that processes e-commerce orders
 * 
 * Endpoint: POST /api/orders
 * Expected payload: { "productId": "string", "quantity": "number" }
 * 
 * @param {Object} context - Azure Functions context object
 * @param {Object} req - HTTP request object
 */
module.exports = async function (context, req) {
    context.log('OrderProcessor function triggered');

    // Set CORS headers for cross-origin requests
    context.res = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        context.res.body = '';
        return;
    }

    try {
        // Validate request method
        if (req.method !== 'POST') {
            context.log.warn(`Invalid method: ${req.method}. Expected POST.`);
            context.res.status = 405;
            context.res.body = {
                error: 'Method not allowed',
                message: 'Only POST requests are supported'
            };
            return;
        }

        // Validate request body exists
        if (!req.body) {
            context.log.warn('Request body is missing');
            context.res.status = 400;
            context.res.body = {
                error: 'Bad Request',
                message: 'Request body is required'
            };
            return;
        }

        // Extract and validate required fields
        const { productId, quantity } = req.body;

        // Validate productId
        if (!productId || typeof productId !== 'string' || productId.trim() === '') {
            context.log.warn('Invalid or missing productId');
            context.res.status = 400;
            context.res.body = {
                error: 'Bad Request',
                message: 'Valid productId is required'
            };
            return;
        }

        // Validate quantity
        if (!quantity || typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
            context.log.warn('Invalid or missing quantity');
            context.res.status = 400;
            context.res.body = {
                error: 'Bad Request',
                message: 'Valid quantity (positive integer) is required'
            };
            return;
        }

        // Generate unique order ID
        const orderId = uuidv4();

        // Log the order request for tracking and debugging
        context.log('Order received:', {
            orderId: orderId,
            productId: productId.trim(),
            quantity: quantity,
            timestamp: new Date().toISOString(),
            userAgent: req.headers['user-agent'] || 'Unknown',
            clientIp: req.headers['x-forwarded-for'] || req.headers['x-client-ip'] || 'Unknown'
        });

        // Simulate order processing (in real implementation, this would interact with databases, payment systems, etc.)
        context.log(`Processing order ${orderId} for product ${productId} (quantity: ${quantity})`);

        // Return successful response
        context.res.status = 200;
        context.res.body = {
            status: 'Order received',
            orderId: orderId,
            productId: productId.trim(),
            quantity: quantity,
            message: 'Your order has been successfully received and is being processed',
            timestamp: new Date().toISOString()
        };

        context.log(`Order ${orderId} processed successfully`);

    } catch (error) {
        // Handle unexpected errors
        context.log.error('Unexpected error in OrderProcessor:', error);
        
        context.res.status = 500;
        context.res.body = {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while processing your order',
            timestamp: new Date().toISOString()
        };
    }
};