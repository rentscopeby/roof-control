const { initTuya, sendDeviceCommand, getDeviceStatus } = require('./tuyaService');

const TEST_DEVICE_ID = 'bfc0ab8e065904940eg1vv'; // IMPORTANT: Replace with your actual device ID

const testConnection = async () => {
    try {
        await initTuya();
        console.log('Tuya API connection test successful!');

        // Test sendDeviceCommand - Open
        console.log('\n--- Testing sendDeviceCommand (Open) ---');
        await sendDeviceCommand(TEST_DEVICE_ID, 'open');
        console.log('Sent open command.');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

        // Test sendDeviceCommand - Close
        console.log('\n--- Testing sendDeviceCommand (Close) ---');
        await sendDeviceCommand(TEST_DEVICE_ID, 'close');
        console.log('Sent close command.');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

        // Test sendDeviceCommand - Stop
        console.log('\n--- Testing sendDeviceCommand (Stop) ---');
        await sendDeviceCommand(TEST_DEVICE_ID, 'stop');
        console.log('Sent stop command.');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

        // Test getDeviceStatus
        console.log('\n--- Testing getDeviceStatus ---');
        const status = await getDeviceStatus(TEST_DEVICE_ID);
        console.log('Device Status:', status);

    } catch (error) {
        console.error('Tuya API connection test failed:', error);
    }
};

testConnection();
