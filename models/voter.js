/**
 * Created by mayomi on 8/5/17.
 */
// Importing Node packages required for schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//= ===============================
// Invite Schema
//= ===============================
const VoterSchema = new Schema({
        voterName: {
            type: String
        },
        voterPhoneNumber: {
            type: String
        },
        voterEmail:{
            type: String,
            required: true
        },
        electionId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Voter', VoterSchema);
