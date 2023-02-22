import { Request, Response, NextFunction } from "express";
import { ReqeustValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => { 
    if (err instanceof ReqeustValidationError) {
        console.log('handling this error as a request validation error');
    }

    if (err instanceof DatabaseConnectionError) {
        console.log('handling this error as a db connection error');
    }

    res.status(400).send({
        message: err.message
    });
};