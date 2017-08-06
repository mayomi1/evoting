/**
 * Created by mayomi on 7/27/17.
 */
'use strict';
const Election = require('../models/election');
const Candidate = require('../models/candidate');
const Voter = require('../models/voter');

//add an election
exports.addElection = (req, res)=> {
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
exports.editElection = (req, res) => {
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
exports.deleteElection = (req, res)=> {
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
exports.getOneElection = (req, res)=>{
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

    Candidate.findOneAndRemove(candidateId, (err)=>{
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
//send an invite to people who are to vote
// add one invitation per person
exports.sendOneInvite = (req, res)=>{
    let  electionId = req.params.electionId;

    let voterName = req.body.voterName,
        voterEmail = req.body.voterEmail,
        voterPhoneNumber = req.body.phoneNumber;

    var oneVoter = new Voter({
        electionId: electionId,
        voterName: voterName,
        voterEmail: voterEmail,
        voterPhoneNumber: voterPhoneNumber
    });

    Election.findById(electionId, (err, election)=>{
        let subject = election.electionTitle;
        let date = election.date;
        let startTime = election.time.startTime,
            stopTime = election.time.stopTime;
        const message = {
            subject: subject,
            text: `${'You are invited to come the vote for your prefer candidate on .\n\n' +
            date + 'from ' + startTime + ' to ' + stopTime +
            ''}\n\n`
        };
    });


    oneVoter.save(function (err, voter) {
        if(err){
            return res.send(err);
            //return res.json({error: true, msg: "An error has occurred , please try again"});
        }
        return res.json(voter);
    });

};

//edit a voter
exports.editVoter = (req, res)=>{
    let voterId = req.params.voterId;

    Voter.findById(voterId, (err, val)=>{
        if(err){
            return res.json({error: true, msg: "An error has occurred , please try again"});
        }
        val.voterName = req.body.voterName || val.voterName;
        val.voterEmail =req.body.voterEmail || val.voterEmail;
        val.voterPhoneNumber = req.body.voterPhoneNumber || val.voterPhoneNumber;

        val.save((err, voter)=>{
            if(err){
                return res.json({error: true, msg: "An error has occurred , please try again"});
            }

            return res.json(voter);
        })

    });
};

//delete a voter
exports.delete = (req, res)=>{
    let voterId = req.params.voteId;

    Voter.findOneAndRemove(voterId, (err)=>{
        if(err){
            return res.json({error: true, msg: "An error has occurred , please try again"});
        }
        return res.json('Successfully deleted');

    })
};

//todo vote

//todo counting of vote
