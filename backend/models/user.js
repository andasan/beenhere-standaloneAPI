const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true //speed up querying request
    },
    password: {
        type: String,
        required: true,
        minlength: 8 //validate
    },
    image: {
        type: String,
        required: true
    },
    places: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Place'
    }]
},
    { timestamps: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);