//function for handling asynchronous errors
//if any error came it will move to 4 parameter route

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}