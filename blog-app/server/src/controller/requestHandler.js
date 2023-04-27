const errorHandler = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message: message,
    });
};

const successHandler = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data,
    });
};

module.exports = { errorHandler, successHandler };