import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request extends Request {}
    interface Response extends Response {}
  }
}
