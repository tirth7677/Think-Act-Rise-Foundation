module.exports = (message, statusCode, data = null) => {
    return {
        status: "success",
        message,
        statusCode,
        data,
    };
};