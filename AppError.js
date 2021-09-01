// file for making xustom error

class AppError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}
//exportion app error class so that we can acess it in other files
module.exports = AppError;