import { HttpStatusCode } from '../helpers/response';
export default class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
    public readonly isOperational: boolean;
    public readonly passthru_message: boolean = false;
 
    constructor(message: string, httpCode: HttpStatusCode, isOperational: boolean) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        
        this.name = this.constructor.toString();
        this.httpCode = httpCode;
        this.isOperational = isOperational;
        
        Error.captureStackTrace(this);
    }
}
