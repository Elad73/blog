import { ValidationError } from "express-validator";
import { CustomError } from "./custome-error";

export class ReqeustValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid requet parameters');

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