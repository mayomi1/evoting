/**
 * Created by mayomi on 7/28/17.
 */

// Importing Node packages required for schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//= ===============================
// Candidate Schema
//= ===============================
const CandidateSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        position: {
            type: String
        },
        picture:{
            type: String
        },
        electionId: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Candidate', CandidateSchema);
