/// <reference types="express">

declare namespace Express {
  interface Request extends Flash {}
}

interface Flash {
  flash(type: string, message: any): void;
}

declare module "express-flash";
