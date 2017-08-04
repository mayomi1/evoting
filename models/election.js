/**
 * Created by mayomi on 7/27/17.
 */

// Importing Node packages required for schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//= ===============================
// Election Schema
//= ===============================
const ElectionSchema = new Schema({
        electionTitle: {
            type: String,
            lowercase: true,
            required: true
        },
        description: {
            type: String
        },
        userId:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Election', ElectionSchema);
