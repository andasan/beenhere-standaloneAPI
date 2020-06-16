const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        return next(new HttpError('Fetching users failed, please try again', 500));
    }
    res.json({ users: users });
}

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
    const { username, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        return next(new HttpError('Sign up failed, please try again', 500));
    }

    if (existingUser) {
        return next(new HttpError('Email already exists', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12); //2nd arg = salting round
    } catch (err) {
        return next(new HttpError('Could not create user, please try again', 500));
    }

    const createdUser = new User({
        username,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again', 500));
    }

    let token;
    try {
        token = jwt.sign( //return a string which will be the token
            { //1st arg: payload of the token, the data you want to encode
                userId: createdUser._id,
                email: createdUser.email
            },
            process.env.SECRET_KEY, //2nd arg: private key, a string that only the server knows |||| DONT SHARE WITH CLIENT
            { expiresIn: '1h' } //3rd arg: optional to configure the token
        );
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again', 500));
    }

    const returnUser = {
        _id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        image: createdUser.image,
        places: []
    }

    res.status(201).json({ user: returnUser, token: token });
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        return next(new HttpError('Logging in failed, please try again', 500));
    }

    if (!existingUser) {
        return next(new HttpError('Invalid credentials, could not log you in', 403));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        return next(new HttpError('Could not log you in, please check your credentials and try again', 500));
    }

    if (!isValidPassword) {
        return next(new HttpError('Invalid credentials, could not log you in', 403));
    }

    let token;
    try {
        token = jwt.sign( //return a string which will be the token
            { //1st arg: payload of the token, the data you want to encode
                userId: existingUser._id,
                email: existingUser.email
            },
            process.env.SECRET_KEY, //2nd arg: private key, a string that only the server knows |||| DONT SHARE WITH CLIENT
            { expiresIn: '1h' } //3rd arg: optional to configure the token
        );
    } catch (err) {
        return next(new HttpError('Loggin in failed, please try again', 500));
    }

    const returnUser = {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        image: existingUser.image,
        places: [...existingUser.places]
    }

    res.status(200).json({ user: returnUser, token: token });
}

