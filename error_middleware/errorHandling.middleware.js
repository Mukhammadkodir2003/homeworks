const { error } = require("winston");
const ApiError = require("../errors/apiError");
const loger = require("../services/logger.service");

module.exports = function (err, req, res, next) {
    loger.error(err.message)
    if (err instanceof ApiError) {
        return res.status(err.status).send({ message: err.message })
    }

    if (err instanceof SyntaxError) {
        return res.status(err.status).send({ message: err.message })
    }

    return res.status(500).send({ message: "nazarda tutilmagan xatolik" })
}