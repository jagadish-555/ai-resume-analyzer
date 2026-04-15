const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParser());

function normalizeOrigin(value = '') {
    return value.trim().replace(/\/$/, '');
}

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(origin => normalizeOrigin(origin))
    .filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);
        const normalizedRequestOrigin = normalizeOrigin(origin);

        if (allowedOrigins.includes(normalizedRequestOrigin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

/*require all the routes here*/
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

/*using all the routes here*/
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;