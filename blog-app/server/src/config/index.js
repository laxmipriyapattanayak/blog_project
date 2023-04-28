require("dotenv").config();

const dev = {
    app: {
        serverPort: process.env.SERVER_PORT || 3001,
        jwtActivationSecretKey: process.env.JWT_ACTIVATION_SECRET_KEY,
        smtpPassword: process.env.SMTP_PASSWORD,
        smtpUserName: process.env.SMTP_USERNAME,
        clientUrl: process.env.CLIENT_URL,
        jwtAuthorizationSecretKey: process.env.JWT_AUTHORIZATION_SECRET_KEY,
    },
    db: {
        url: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/user-admin-db",

    },
}

module.exports = dev;