/**
 * Created by mayomi on 7/12/17.
 */
'use strict';
const User = require('../models/user-admin');
const setUserInfo = require('../helpers').setUserInfo;


exports.getAccount = (req, res, next)=> {

    let userId = req.params.userId;
    if (req.user._id.toString() !== userId) {
        return res.status(401).json({error: 'You are not authorized to view this user profile.'});
    }

    User.findById(userId, (err, user) => {
        if (err) {
            res.status(400).json({error: 'No user could be found for this ID.'});
            return next(err);
        }
        const userToReturn = setUserInfo(user);

        return res.status(200).json({user: userToReturn});
    });
};


//todo user should be able to edit their account

//todo user should be able to delete their account



