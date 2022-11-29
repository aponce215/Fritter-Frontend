import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BenevolenceCollection from './collection';
import * as userValidator from '../user/middleware';
import * as benevolenceValidator from './middleware';

import * as util from './util';

const router = express.Router();


/**
 * Get benevolence by author.
 *
 * @name GET /api/benevolence?authorId=id
 *
 * @return {BenevolenceResponse} - Benevolence of specific user
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
    const benevolence = await BenevolenceCollection.findOne(req.query.author as string);
    const response = util.constructGenBenevolenceResponse(benevolence);
    res.status(200).json(response);
  }
);

/**
 * Get benevolence from logged in user.
 *
 * @name GET /api/benevolence/myBenevolence
 *
 * @return {BenevolenceResponse} - An array of freets created by user with id, authorId
 * @throws {404} - If no user has given authorId
 *
 */
 router.get(
    '/myBenevolence',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const benevolence = await BenevolenceCollection.findOneById(userId);
      const response = util.constructMyBenevolenceResponse(benevolence);
      res.status(200).json(response);
    }
  );

/**
 * Create a report of a user.
 *
 * @name PUT /api/benevolence/report
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in or duplicate report
 * @throws {404} - If user does not exist
 */
router.put(
  '/report',
  [
    userValidator.isUserLoggedIn,
    benevolenceValidator.checkUserExist,
    benevolenceValidator.DuplicateReport
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    // const freet = await BenevolenceCollection.report(userId, req.body.content);
    const benevolence = await BenevolenceCollection.report(req.body.user, userId);

    res.status(201).json({
      message: 'Your report was received.',
      benevolence: util.constructMyBenevolenceResponse(benevolence)
    });
  }
);

/**
 * Nominate of a user.
 *
 * @name PUT /api/benevolence/nominate
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If user does not exist
 * @throws {403} - If user duplicate vote, or not enough votes
 */
 router.put(
    '/nominate',
    [
      userValidator.isUserLoggedIn,
      benevolenceValidator.checkUserExist,
      benevolenceValidator.DuplicateVote,
      benevolenceValidator.HasVotesLeft,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      // const freet = await BenevolenceCollection.report(userId, req.body.content);
      const benevolence = await BenevolenceCollection.nominate(req.body.user, userId);
  
      res.status(201).json({
        message: 'Your nomination was received.',
        benevolence: util.constructMyBenevolenceResponse(benevolence)
      });
    }
  );

export {router as benevolenceRouter};