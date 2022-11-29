import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ShareTimeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();


/**
 * Get shareTime by author.
 *
 * @name GET /api/shareTime?authorId=id
 *
 * @return {ShareTimeResponse} - ShareTime of a specific user
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    res.status(400).json("No user given");
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const shareTime = await ShareTimeCollection.findOne(req.query.author as string);
    const response = util.constructShareTimeResponse(shareTime);
    res.status(200).json(response);
  }
);

/**
 * Get shareTime from logged in user.
 *
 * @name GET /api/shareTime/myShareTime
 *
 * @return {BenevolenceResponse} - An array of freets created by user with id, authorId
 * @throws {403} - If user is not logged in
 *
 */
 router.get(
    '/myShareTime',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const shareTime = await ShareTimeCollection.findOneById(userId);
      const response = util.constructMyShareTimeResponse(shareTime);
      res.status(200).json(response);
    }
  );

export {router as shareTimeRouter};