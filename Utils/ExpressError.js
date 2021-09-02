// file for making custom error

class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
//exportion app error class so that we can acess it in other files
module.exports = ExpressError;