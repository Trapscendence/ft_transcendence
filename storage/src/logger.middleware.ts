import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const nestLogger = new Logger('HTTP');

export function logger(req: Request, res: Response, next: NextFunction) {
  const { ip, method, path: url } = req;
  const userAgent = req.get('user-agent') || '';

  res.on('close', () => {
    const { statusCode } = res;
    const contentLength = res.get('content-length');

    nestLogger.log(
      `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
    );
  });

  next();
}
