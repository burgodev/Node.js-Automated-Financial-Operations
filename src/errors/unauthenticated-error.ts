import { HttpStatusCode } from '../helpers/response';
import BaseError from "./base-error";

export default class UnauthenticatedError extends BaseError {

    public readonly passthru_message: boolean = true;

    constructor(message = 'User not authenticated', httpCode = HttpStatusCode.UNAUTHORIZED, isOperational = false) {
        super(message, httpCode, isOperational);
    }
    
}