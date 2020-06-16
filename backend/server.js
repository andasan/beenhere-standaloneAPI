require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ extended: false }));
app.use(cors());

//by default, none of the server files are accessible from outside the server
app.use('/uploads/images', express.static(path.join('uploads', 'images'))); //serving images statically

app.use(express.static(path.join('client', 'build')));

app.use('/api/places', placesRoutes); //(path filter, route)
app.use('/api/users', usersRoutes);

app.use((req,res,next)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

//response error
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

//if a fourth parameter is added, express will treat this as a special middleware func, an error handler
app.use((error, req, res, next) => {

    //rollback image upload
    if(req.file){//file is from multer, injected into request
        fs.unlink(req.file.path, (err)=> {//path exists on the file object
            console.log(err);
        }); 
    } 
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({ message: error.message, code: error.code || 'An unknown error occurred' });
});

mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {
        console.log('Connected!');
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    });