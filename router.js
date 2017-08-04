/**
 * Created by mayomi on 7/6/17.
 */

const AuthController = require('./controllers/auth');
const ElectionController = require('./controllers/election');
const express = require('express');
const passport = require('passport');
const AccountController = require('./controllers/accountInfo');

const passportService = require('./config/passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {
    // Initializing route groups
    const apiRoutes = express.Router(),
        accountRoutes = express.Router(),
        electionRoutes = express.Router(),
        authRoutes = express.Router();

    //= ========================
    // Auth Routes
    //= ========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    // Registration route
    authRoutes.post('/register', AuthController.register);

    // Login route
    authRoutes.post('/login', requireLogin, AuthController.login);

    //= =========================
    // Admin User Accounts Routes
    //= =========================

    //set account routes as subgroup to apiRoutes
    apiRoutes.use('/account', accountRoutes);

    // to show details of the user
    accountRoutes.get('/:userId', requireAuth, AccountController.getAccount);


    //= =========================
    // Election Routes
    //= =========================

    //Set election routes as subgroup to apiRoutes
    apiRoutes.use('/election', electionRoutes);

    //to get all users elections
    // ===>> /api/election
    electionRoutes.get('/', requireAuth, ElectionController.getElection);

    //to get one user elections
    //  ==>>> /api/election/:electionId
    electionRoutes.get('/:electionId',requireAuth, ElectionController.getOneElection);

    //To add a new election
    //=>>>  /api/election/create
    electionRoutes.post('/create', requireAuth, ElectionController.addElection);

    //To edit an election
    // =>>> /api/election/edit/:electionId
    electionRoutes.patch('/edit/:electionId', requireAuth, ElectionController.editElection);

    //To delete an election
    // ==>>> /api/election/delete/:electionId
    electionRoutes.delete('/delete/:electionId', requireAuth, ElectionController.deleteElection);

    //To add a candidate
    // ==>> /api/election/:electionId
    electionRoutes.post('/:electionId', requireAuth, ElectionController.addCandidate);

    //To edit a candidate
    // ==>> /api/election/edit-cad/:candidateId
    electionRoutes.patch('/edit-cad/:candidateId', requireAuth, ElectionController.editCandidate);

    //To delete a candidate
    // ==>> /api/election/remove-cad/:candidateId
    electionRoutes.delete('/remove-cad/:candidateId', requireAuth, ElectionController.removeCandidate);

    //To get all candidate
    // ==>> /api/election/candidate/:electionId
    electionRoutes.get('/candidate/:electionId', requireAuth, ElectionController.getAllCandidate);

    //To get one candidate
    // ==>> /api/election/cand/:candidateId
    electionRoutes.get('/cand/:candidateId', requireAuth, ElectionController.getOneCandidate);


    // Set url for API group routes
    app.use('/api', apiRoutes);
};

