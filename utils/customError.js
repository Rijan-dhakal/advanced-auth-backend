export const customError = function(msg, statusCode){
    const error = new Error(msg);
    error.statusCode = statusCode;
    throw error;
}