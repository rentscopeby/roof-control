require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const config = require('./config');
const tuyaService = require('./tuyaService');

const PORT = process.env.PORT || 3000;

// Validate environment variables
if (!config.TUYA_ACCESS_ID || !config.TUYA_ACCESS_KEY || !config.TUYA_DEVICE_ID) {
    console.error('Error: Missing Tuya API credentials in .env file.');
    process.exit(1);
}

console.log('Tuya Access ID:', config.TUYA_ACCESS_ID);
console.log('Tuya Access Key:', config.TUYA_ACCESS_KEY ? '********' : 'Missing'); // Mask key for security
console.log('Tuya Device ID:', config.TUYA_DEVICE_ID);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define GET /api/status route
app.get('/api/status', async (req, res) => {
    try {
        const status = await tuyaService.getDeviceStatus(config.TUYA_DEVICE_ID);
        res.status(200).json(status);
    } catch (error) {
        console.error('Error fetching device status:', error);
        res.status(500).json({ error: 'Failed to fetch device status' });
    }
});

// Define POST endpoints for gate control
app.post('/api/control/open', async (req, res) => {
    try {
        await tuyaService.sendDeviceCommand(config.TUYA_DEVICE_ID, 'open');
        res.status(200).json({ message: 'Open command sent' });
    } catch (error) {
        console.error('Error sending open command:', error);
        res.status(500).json({ error: 'Failed to send open command' });
    }
});

app.post('/api/control/close', async (req, res) => {
    try {
        await tuyaService.sendDeviceCommand(config.TUYA_DEVICE_ID, 'close');
        res.status(200).json({ message: 'Close command sent' });
    } catch (error) {
        console.error('Error sending close command:', error);
        res.status(500).json({ error: 'Failed to send close command' });
    }
});

app.post('/api/control/stop', async (req, res) => {
    try {
        await tuyaService.sendDeviceCommand(config.TUYA_DEVICE_ID, 'stop');
        res.status(200).json({ message: 'Stop command sent' });
    } catch (error) {
        console.error('Error sending stop command:', error);
        res.status(500).json({ error: 'Failed to send stop command' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
