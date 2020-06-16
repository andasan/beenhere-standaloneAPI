const fs = require('fs');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../util/location');
const mongoose = require('mongoose');

const Place = require('../models/place');
const User = require('../models/user');

exports.getPlacesByUserId = async(req, res, next) => {
    const userId = req.params.uid;

    // let places;
    let userWithPlaces;
    try{
        // places = await Place.findById({ creator: userId });
        userWithPlaces = await User.findById(userId).populate('places');
    }catch(err){
        return next( new HttpError('Something went wrong, could not find a place.', 500));
    }

    // if (places.length === 0) {
    //     return next(new HttpError('Could not find places for the provided user id', 404));
    // }
    // res.json({ places });
    if (!userWithPlaces || userWithPlaces.length === 0) {
        return next(new HttpError('Could not find places for the provided user id', 404));
    }
    res.json({ userWithPlaces });
};

exports.getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next( new HttpError('Something went wrong, could not find a place.', 500));
    }

    if (!place) {
        return next(new Error('Could not find a place for the provided id', 404));
    }
    res.json({ place })
}

//async + await to work with promises
exports.postPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
    const { title, description, address, creator } = req.body;

    let coordinates;

    //to handle error in async await, use try and catch
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator
    });

    //check of the id of the logged in user exists already
    let user;
    try{
        user = await User.findById(creator);
    }catch(err){
        return next(new HttpError('Creating place failed, please try again', 500));
    }

    if(!user){
        return next(new HttpError('Could not find user for provided id', 404));
    }

    //if user is existing..
    // console.log(user);
    //add place id to corresponding user
    try{
        // await createdPlace.save();
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session:sess}); //created the unique place id
        user.places.push(createdPlace); //push means establish connection between 2 models
        await user.save({session:sess});
        await sess.commitTransaction();

    }catch(err){
        return next(new HttpError('Creating place failed, please try again', 500));
    }

    // PLACES.push(createdPlace);
    res.status(201).json({ place: createdPlace, message: "A new place has been created." });
}

exports.patchPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422))
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;

    let updatedPlace;
    try{
        updatedPlace = await Place.findById(placeId);
    }catch(err){
        return next( new HttpError('Something went wrong, could not update place.', 500));
    }

    //authorization checker ----- toString converts mongoose object id to string
    if(updatedPlace.creator.toString() !== req.userData.userId){
        return next( new HttpError('You are not authorized to edit this place', 401));
    }

    updatedPlace.title = title;
    updatedPlace.description = description;

    try{
        await updatedPlace.save();
    }catch(err){
        return next( new HttpError('Something went wrong, could not update place.', 500));
    }

    res.status(200).json({ place: updatedPlace });
}

exports.deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId).populate('creator');
    }catch(err){
        return next( new HttpError('Something went wrong, could not delete place.', 500));
    }

    if(!place){
        return next(new HttpError('Could not find place for provided id', 404));
    }

    //authorization checker ----- toString converts mongoose object id to string
    if(place.creator._id.toString() !== req.userData.userId){
        return next( new HttpError('You are not authorized to delete this place', 401));
    }

    const imagePath = place.image;

    try{
        // await place.remove();
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session:sess}); //remove the place
        place.creator.places.pull(place); //access the place stored in the user and pull it
        await place.creator.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        return next( new HttpError('Something went wrong, could not delete place.', 500));
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    });

    res.status(200).json({ place: place, message: 'Deleted place' });
}