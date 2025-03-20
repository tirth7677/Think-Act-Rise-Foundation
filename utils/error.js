module.exports = (message, statusCode) => {
    return {
        status: "fail",
        message,
        statusCode,
    };
};
