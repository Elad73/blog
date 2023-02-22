import { ValidationError } from "express-validator";

export class ReqeustValidationError extends Error {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super();

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, ReqeustValidationError.prototype);
    }

    serializeErrors() {
        const formattedErrors = this.errors.map(err => {
            return { message: err.msg, field: err.param };
        });

        return formattedErrors;
    }
}