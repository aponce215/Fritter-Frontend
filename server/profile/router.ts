import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ProfileCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get profile from an author.
 *
 * @name GET /api/profile?author=username
 *
 * @return {ProfileResponse} - Profile created by username
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorProfile = await ProfileCollection.findOne(req.query.author as string);
    const response = util.constructProfileResponse(authorProfile);
    res.status(200).json(response);
  }
);

/**
 * Get profile from logged in user
 *
 * @name GET /api/profile/myProfile
 *
 * @return {ProfileResponse} - Profile created by username
 * @throws {403} - If username is not logged in
 *
 */
 router.get(
    '/myProfile',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const authorProfile = await ProfileCollection.findOneById(userId);
      const response = util.constructMyProfileResponse(authorProfile);
      res.status(200).json(response);
    }
  );

/**
 * Modify a profile
 *
 * @name PUT /api/profile
 *
 * @param {string} description - the new description for the profile
 * @param {string} displayName - the new displayName for the profile
 * @param {string} birthday - the new birthday for the profile
 * @return {ProfileResponse} - the updated profile
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the profile
 * @throws {400} - If the profile content is empty or a stream of empty spaces
 * @throws {413} - If the profile content is more than 140 characters long
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn

    const profile = await ProfileCollection.updateOne(userId, req.body.description, req.body.displayName, req.body.birthday);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      profile: util.constructMyProfileResponse(profile)
    });
  }
);

/**
 * Modify profile privacy
 *
 * @name PUT /api/profiles/showBirthday
 *
 * @return {ProfileResponse} - the updated profile
 * @throws {403} - if the user is not logged in
 */
 router.put(
    '/showBirthday',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const profile = await ProfileCollection.updateBirthday(userId, true);
      res.status(200).json({
        message: 'Your birthday is now public.',
        profile: util.constructMyProfileResponse(profile)
      });
    }
  );

/**
 * Modify profile privacy
 *
 * @name PUT /api/profiles/hideBirthday
 *
 * @return {ProfileResponse} - the updated profile
 * @throws {403} - if the user is not logged in
 */
 router.put(
    '/hideBirthday',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const profile = await ProfileCollection.updateBirthday(userId, false);
      res.status(200).json({
        message: 'Your birthday is now hidden.',
        profile: util.constructMyProfileResponse(profile)
      });
    }
  );
  

export {router as profileRouter};