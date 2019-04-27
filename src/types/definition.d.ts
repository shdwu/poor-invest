import 'express-validator';

declare module 'express-validator' {
    interface Validator {
        custom(fn: (v: any)=>boolean): Validator;
    }
}