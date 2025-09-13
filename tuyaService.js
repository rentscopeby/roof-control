const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
const config = require('./config');

let tuya = null;

const initTuya = async () => {
    // Always create a new TuyaContext instance for debugging
    console.log('Current timestamp before TuyaContext init:', new Date().getTime());
    const newTuya = new TuyaContext({
        accessKey: config.TUYA_ACCESS_ID,
        secretKey: config.TUYA_ACCESS_KEY,
        baseUrl: config.TUYA_API_ENDPOINT,
    });
    console.log('Initialized Tuya client.');
    return newTuya;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getDeviceStatus = async (deviceId) => {
    const client = await initTuya();
    try {
        const result = await client.request({
            method: 'GET',
            path: `/v2.0/cloud/thing/${deviceId}/shadow/properties`,
        });

        if (result && result.result && result.result.properties) {
            const properties = result.result.properties;
            const lOpenDP = properties.find(dp => dp.code === 'l_open');
            const lCloseDP = properties.find(dp => dp.code === 'l_close');

            if (lOpenDP && typeof lOpenDP.value === 'boolean') {
                const status = { door_open: lOpenDP.value };
                console.log(`Getting status for device: ${deviceId}`, status);
                return status;
            } else if (lCloseDP && typeof lCloseDP.value === 'boolean') {
                // If l_open is not available or not boolean, check l_close
                const status = { door_open: !lCloseDP.value }; // If l_close is true, door is closed (not open)
                console.log(`Getting status for device: ${deviceId}`, status);
                return status;
            } else {
                console.warn(`Neither 'l_open' nor 'l_close' DPs found or are boolean for device ${deviceId}. Full properties:`, properties);
                return { door_open: 'unknown' };
            }
        } else {
            console.warn(`No properties result for device ${deviceId}. Full response:`, result);
            return { door_open: 'unknown' };
        }
    } catch (error) {
        console.error(`Error getting device status for ${deviceId}:`, error);
        throw error;
    }
};

const sendDeviceCommand = async (deviceId, commandType) => {
    const client = await initTuya();
    let dpCode = '';

    switch (commandType) {
        case 'open':
            dpCode = 'wfh_open';
            break;
        case 'close':
            dpCode = 'wfh_close';
            break;
        case 'stop':
            dpCode = 'wfh_stop';
            break;
        default:
            throw new Error(`Unsupported command type: ${commandType}`);
    }

    try {
        const commands = [{ code: dpCode, value: true }]; // Assuming these are boolean commands
        const result = await client.request({
            method: 'POST',
            path: `/v1.0/iot-03/devices/${deviceId}/commands`,
            body: {
                commands: commands,
            },
        });
        console.log(`Sending command '${commandType}' (code: ${dpCode}) to device: ${deviceId}`, result);
        return { success: true, message: `Command '${commandType}' sent.` };
    } catch (error) {
        console.error(`Error sending command '${commandType}' to device ${deviceId}:`, error.message);
        throw error;
    }
};

module.exports = {
    initTuya,
    getDeviceStatus,
    sendDeviceCommand,
};