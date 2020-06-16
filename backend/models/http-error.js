class HttpError extends Error {
    constructor(message, errorCode){
        //super to call the constructor of the base class
        super(message); //Add a "message" property
        this.code = errorCode; // Adds a "code" property
    }
}

module.exports = HttpError;