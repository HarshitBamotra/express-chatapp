const BadRequest = require("./badRequest.error");
const BaseError = require("./base.error");
const InternalServerError = require("./internalServerError");
const NotFound = require("./notFound.error");

module.exports = {
    BaseError: BaseError,
    NotFound: NotFound,
    BadRequest: BadRequest,
    InternalServerError: InternalServerError
}