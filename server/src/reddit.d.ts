import Reddit from './services/reddit'

declare global {
  namespace Express {
    interface Request {
      reddit?: Reddit
    }
  }
}