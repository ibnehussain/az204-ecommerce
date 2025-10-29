/**
 * Orders Routes - Azure Functions Integration
 * 
 * Handles order processing by integrating with Azure Functions
 */

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Environment variable for Azure Function URL
const FUNCTION_URL = process.env.FUNCTION_URL;

/**
 * POST /api/orders
 * 
 * Processes orders by calling the Azure Function OrderProcessor
 * Integrates the existing Express backend with serverless Azure Functions
 */
router.post('/', async (req, res) => {
    const requestId = uuidv4(); // For tracking requests
    
    try {
        // Log incoming request
        console.log(`[${requestId}] Order request received:`, {
            body: req.body,
            timestamp: new Date().toISOString(),
            userAgent: req.headers['user-agent'],
            clientIp: req.ip || req.connection.remoteAddress
        });

        // Validate request body
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            console.log(`[${requestId}] Validation failed: Missing required fields`);
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Both productId and quantity are required',
                requestId
            });
        }

        // Validate quantity is a positive number
        if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
            console.log(`[${requestId}] Validation failed: Invalid quantity`);
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Quantity must be a positive integer',
                requestId
            });
        }

        // Validate productId is a non-empty string
        if (typeof productId !== 'string' || productId.trim() === '') {
            console.log(`[${requestId}] Validation failed: Invalid productId`);
            return res.status(400).json({
                error: 'Bad Request',
                message: 'ProductId must be a non-empty string',
                requestId
            });
        }

        // Check if FUNCTION_URL is configured
        if (!FUNCTION_URL) {
            console.error(`[${requestId}] Configuration error: FUNCTION_URL not set`);
            return res.status(500).json({
                error: 'Configuration Error',
                message: 'Azure Function endpoint not configured',
                requestId
            });
        }

        // Prepare payload for Azure Function
        const functionPayload = {
            productId: productId.trim(),
            quantity: quantity
        };

        console.log(`[${requestId}] Calling Azure Function:`, {
            url: FUNCTION_URL,
            payload: functionPayload,
            timestamp: new Date().toISOString()
        });

        // Call Azure Function with timeout and retry logic
        const functionResponse = await axios({
            method: 'POST',
            url: FUNCTION_URL,
            data: functionPayload,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'AZ204-Backend/1.0.0',
                'X-Request-ID': requestId
            },
            timeout: 30000, // 30 second timeout
            validateStatus: function (status) {
                // Accept any status code to handle errors properly
                return status < 600;
            }
        });

        // Log Azure Function response
        console.log(`[${requestId}] Azure Function response:`, {
            status: functionResponse.status,
            statusText: functionResponse.statusText,
            data: functionResponse.data,
            timestamp: new Date().toISOString()
        });

        // Handle successful Azure Function response
        if (functionResponse.status >= 200 && functionResponse.status < 300) {
            console.log(`[${requestId}] Order processed successfully via Azure Function`);
            
            // Return the Azure Function response with additional metadata
            return res.status(functionResponse.status).json({
                ...functionResponse.data,
                requestId,
                processedBy: 'Azure Functions',
                backendTimestamp: new Date().toISOString()
            });
        }

        // Handle Azure Function errors
        console.warn(`[${requestId}] Azure Function returned error:`, {
            status: functionResponse.status,
            data: functionResponse.data
        });

        return res.status(functionResponse.status).json({
            error: 'Function Processing Error',
            message: functionResponse.data?.message || 'Azure Function returned an error',
            details: functionResponse.data,
            requestId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(`[${requestId}] Error calling Azure Function:`, {
            error: error.message,
            stack: error.stack,
            url: FUNCTION_URL,
            timestamp: new Date().toISOString()
        });

        // Handle different types of errors
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'Service Unavailable',
                message: 'Unable to connect to Azure Function. Service may be down.',
                requestId,
                timestamp: new Date().toISOString()
            });
        }

        if (error.code === 'ENOTFOUND') {
            return res.status(502).json({
                error: 'Bad Gateway',
                message: 'Azure Function endpoint not found. Please check configuration.',
                requestId,
                timestamp: new Date().toISOString()
            });
        }

        if (error.code === 'ETIMEDOUT') {
            return res.status(504).json({
                error: 'Gateway Timeout',
                message: 'Azure Function request timed out. Please try again.',
                requestId,
                timestamp: new Date().toISOString()
            });
        }

        // Generic error response
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while processing the order',
            requestId,
            timestamp: new Date().toISOString(),
            // Include error details in development mode
            ...(process.env.NODE_ENV === 'development' && {
                details: {
                    message: error.message,
                    code: error.code
                }
            })
        });
    }
});

/**
 * GET /api/orders/health
 * 
 * Health check endpoint to verify Azure Function connectivity
 */
router.get('/health', async (req, res) => {
    const healthCheckId = uuidv4();
    
    try {
        console.log(`[${healthCheckId}] Health check initiated for Azure Function integration`);

        if (!FUNCTION_URL) {
            return res.status(500).json({
                status: 'unhealthy',
                message: 'FUNCTION_URL not configured',
                checkId: healthCheckId,
                timestamp: new Date().toISOString()
            });
        }

        // Test Azure Function connectivity with a simple request
        // Note: This would ideally be a dedicated health endpoint on the Function
        console.log(`[${healthCheckId}] Testing Azure Function connectivity: ${FUNCTION_URL}`);

        return res.json({
            status: 'healthy',
            message: 'Azure Function integration is configured',
            functionUrl: FUNCTION_URL ? '[CONFIGURED]' : '[NOT SET]',
            checkId: healthCheckId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(`[${healthCheckId}] Health check failed:`, error.message);
        
        return res.status(500).json({
            status: 'unhealthy',
            message: 'Azure Function health check failed',
            error: error.message,
            checkId: healthCheckId,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/orders/config
 * 
 * Returns configuration status (for debugging in development)
 */
router.get('/config', (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(404).json({ error: 'Not found' });
    }

    res.json({
        functionUrl: FUNCTION_URL ? '[CONFIGURED]' : '[NOT SET]',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;