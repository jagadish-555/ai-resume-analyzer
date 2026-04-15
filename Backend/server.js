require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

function logStartupEnvWarnings() {
    if (process.env.NODE_ENV !== 'production') {
        console.warn('[startup] NODE_ENV is not set to production. Auth cookies may not persist as expected in deployed environments.');
    }

    if (!process.env.CORS_ORIGIN) {
        console.warn('[startup] CORS_ORIGIN is missing. Default localhost allowlist will be used.');
    }

    if (!process.env.JWT_SECRET) {
        console.warn('[startup] JWT_SECRET is missing. Auth endpoints will fail.');
    }
}

connectDB();
logStartupEnvWarnings();
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});