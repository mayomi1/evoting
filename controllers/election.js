/**
 * Created by mayomi on 7/27/17.
 */
'use strict';
const Election = require('../models/election');
const Candidate = require('../models/candidate');
//add an election
exports.addElection = (req, res, next)=> {
    //if there user is not login
    if (!req.user) {
        return res.json({error: 'You are not authorized to view this user profile.'});
    }

    let userId = req.user._id;
    let electionTitle = req.body.title;
    let electionDescription = req.body.description;

    const newElection = new Election({
        userId: userId,
        electionTitle: electionTitle,
        description: electionDescription
    });

    newElection.save(function (err, savedElection) {
        if (err) {
            return res.json({error: true, msg: "An error has occurred , please try again"});
        }
        return res.json(savedElection);
    });
};


//edit an election
exports.editElection = (req, res, next) => {
    //if there user is not login
    if (!req.user) {
        return res.json({error: 'You are not authorized to view this user profile.'});
    }
    let title = req.body.title;
    let description = req.body.description;



    Election.findById(req.params.electionId, (err, election) => {
        election.electionTitle = title || election.electionTitle;
        election.description = description || election.description;

        election.save((err)=> {
            if (err) {
                return res.json({error: true, msg: "An error has occurred , please try again"});
            }
            return res.json(election);

        });


    });
};
//remove an election
exports.deleteElection = (req, res, next)=> {
    let election = req.params.electionId;
    if (!election) {
        return res.json({error: true, msg: "sorry an Id is required"})
    }
    //make they enter the title of the election before deleting
    let title = req.body.title;
    Election.findById(election, function (err, election) {
        //no election is in the database
        if(!election){
            return res.json({error:true, msg: "No election added yet"})
        }
        //an error in query
        if (err) {
            return res.json({error: true, msg: "An error has occurred , please try again"});
        }

        if (election.electionTitle != title) {
            return res.json({error: true, msg: "wrong title :D"});
        } else {
            election.remove(function (err) {
                if(err){
                    return res.json({error: true, msg: "An error has occurred , please try again"});
                }
                return res.json({error: false, msg: "Delete successfully"})
            });

        }
    });
};

exports.getElection = (req, res)=> {
    if(!req.user){
        return res.json({error: true, msg: "You are not authorized to view this page"})
    }
    Election.find({userId: req.user._id}, function (err, userElections) {
        return res.json(userElections);
    })
};

//route for a single election
exports.getOneElection = (req, res, next)=>{
    let electionId = req.params.electionId;
    let userId = req.user._id;


    Election.findOne({_id: electionId, userId: userId}, function (err, election) {
        if(!election){
            return res.json({error:true, msg: "Wrong id"})
        }
        if(err){
            return res.json({error: true, msg: "An error has occurred , please try again"});
        }

        return res.json({error: false, election: election})
    })
};

//add the candidate
exports.addCandidate = function (req, res) {
    let electionId = req.params.electionId;
    //check the election Id
    if(!electionId){
        return res.json({error: true, msg: "You have not created an election yet"});
    }
    let name = req.body.name;
    let position = req.body.position;

    let newCandidate = new Candidate({
        name: name,
        position: position,
        electionId: electionId
    });

    newCandidate.save((err, candidate)=>{
        if(err){

            return res.json({error: true, msg: "An error has occurred , please try again"});
        }

        return res.json({error: false, candidate: candidate});
    });

};
//edit the candidate
exports.editCandidate  =  function (req, res) {
    let candidateId = req.params.candidateId;

    if(!candidateId){
        return res.json({error: true, msg: "An error has occurred , please try again"})
    }

    let name = req.body.name;
    let position = req.body.position;

    Candidate.findById(candidateId, function (err, cand) {
        if(!cand){
            return res.json({error: true, msg: "An error has occurred , please try again"})
        }
        cand.name = name || cand.name;
        cand.position = position ||  cand.name;

        cand.save(function (err) {
            if(err){
                return res.json({error: true, msg: "An error has occurred , please try again"});
            }
            return res.json({error: false, candidate: cand});
        });
    });


};

//remove the candidate
exports.removeCandidate = (req, res)=>{
    let candidateId = req.params.candidateId;

    Candidate.findOneAndRemove(candidateId, (err, cand)=>{
        if(err){
            return res.json({error: true, msg: "An error has occurred , please try again"});
        }

        return res.json({error: true, msg: "candidate successfully deleted"});
    })
};

//todo get all candidates added
exports.getAllCandidate = function (req, res) {
    let electionId = req.params.electionId;

    Candidate.find({electionId: electionId}, function (err, allCand) {
        return res.json(allCand);
    });

};


//get one candidate
exports.getOneCandidate = function(req, res) {
    let candidateId = req.params.candidateId;

    Candidate.findById(candidateId, (err, oneCand)=> {
        if(err){
            return res.json({error: true, msg: "An error has occurred , please try again"});
        }
        return res.json(oneCand)
    });

};




//todo send an invite to people who are to vote
//todo counting of vote
