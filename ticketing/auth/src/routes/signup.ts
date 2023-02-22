import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { ReqeustValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post('/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Pass must be between 4 and 20 chars')
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            throw new ReqeustValidationError(errors.array());
        }
        
        const { email, password } = req.body;
        
        console.log('Creating a user...');
        throw new DatabaseConnectionError();

        res.send({});
    }
);

export { router as signupRouter }