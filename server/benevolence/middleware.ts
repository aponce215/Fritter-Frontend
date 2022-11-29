import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BenevolenceCollection from '../benevolence/collection';
import UserCollection from '../user/collection';
import { PopulatedBenevolence } from './model';

/**
 * Checks if the current user has any votes left
 */
 const HasVotesLeft = async (req: Request, res: Response, next: NextFunction) => {
    const benevolenceR = await BenevolenceCollection.findOneById((req.session.userId as string) ?? '');
    const votes = benevolenceR.myVotes;

    if (votes.length >= 3){
        res.status(403).json({
            error: 'You already submitted your max nominations'
            });
            return;
    }

    next();
};
  
/**
 * Checks if the current user already voted for someone
 */
 const DuplicateVote = async (req: Request, res: Response, next: NextFunction) => {
    const userToNom = await UserCollection.findOneByUsername(req.body.user);

    const benevolenceR = await BenevolenceCollection.findOneById((req.session.userId as string) ?? '');

    const benCopy: PopulatedBenevolence = {
        ...benevolenceR.toObject({
          versionKey: false // Cosmetics; prevents returning of __v property
        })
    };

    const votes = benCopy.myVotes;
    
    if (userToNom._id == req.session.userId){
        res.status(403).json({
            error: 'can not vote for self'
            });
            return;
    }
    for (const person of votes){
        if (person.username === userToNom.username){
            res.status(403).json({
                error: 'Already voted for this user'
                });
                return;
        }
    }
    next();
};

/**
 * Checks if the current user already reported someone
 */
 const DuplicateReport = async (req: Request, res: Response, next: NextFunction) => {
    const userToReport = await UserCollection.findOneByUsername(req.body.user);
    
    const benevolenceR = await BenevolenceCollection.findOneById((req.session.userId as string) ?? '');

    const benCopy: PopulatedBenevolence = {
        ...benevolenceR.toObject({
          versionKey: false // Cosmetics; prevents returning of __v property
        })
    };

    const reports = benCopy.myReports;
    
    for (const person of reports){
        if (person.username == userToReport.username){
            res.status(403).json({
                error: 'Already reported this user'
                });
                return;
        }
    }
    next();
};

/**
 * Checks if body contains user that exists
 */
 const checkUserExist = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUsername(req.body.user as string);
    if (!user) {
        res.status(404).json({
            error: `A user with username ${req.body.user as string} does not exist.`
        });
        return;
    }
    next();
};


export{
    HasVotesLeft,
    DuplicateReport,
    DuplicateVote,
    checkUserExist
}