const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.get('/:pid', placesControllers.getPlaceById);

//middleware blocker, protects the bottom routes
router.use(checkAuth); //pass a pointer, no need to execute the function

router.post('/',
    fileUpload.single('image'), //retrieve a single file
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5 }),
        check('address').not().isEmpty()
    ],
    placesControllers.postPlace
);

router.patch('/:pid', [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 })
], placesControllers.patchPlace);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;