import { NextFunction, Request, Response } from 'express'

function errorMiddleware(error: any, request: Request, response: Response, next: NextFunction) {
  const status = error.status || 500
  const message = error.message || '系统内部错误，请联系管理员'
  response
    .status(status)
    .send(message)
}

export default errorMiddleware
