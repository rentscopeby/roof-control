# Roof Control

This project allows you to control a Tuya-based roof cover using a simple web interface or API calls.

## Prerequisites

*   Node.js and npm installed.
*   A Tuya device and API credentials.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd roof-control
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```

    Edit the `.env` file with your Tuya API credentials:
    ```
    TUYA_ACCESS_ID=your_tuya_access_id
    TUYA_ACCESS_KEY=your_tuya_access_key
    TUYA_DEVICE_ID=your_tuya_device_id
    TUYA_API_ENDPOINT=https://openapi.tuyaeu.com
    ```

## Launching the Server

To start the server, run the following command:

```bash
node server.js
```

The server will start on `http://localhost:3000`.

## Usage

You can control the roof by sending `POST` requests to the following endpoints using `curl` or any other API client.

### Open the Roof

```bash
curl -X POST http://localhost:3000/api/control/open
```

### Close the Roof

```bash
curl -X POST http://localhost:3000/api/control/close
```

### Stop the Roof

```bash
curl -X POST http://localhost:3000/api/control/stop
```

### Get Device Status

```bash
curl http://localhost:3000/api/status
```
