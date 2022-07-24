const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Image = require("../models/image");
const slugify = require("slugify");
const jwt= require('jsonwebtoken');
const expressJwt=require('express-jwt');

const User = require("../models/user");
const formidable = require("formidable");
const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");
const fs=require('fs');
// uuid.v4();

// const getPlaceById = (req, res, next) => {
//   const placeId = req.params.pid; // { pid: 'p1' }

//   const place = DUMMY_PLACES.find((p) => {
//     return p.id === placeId;
//   });

//   if (!place) {
//     throw new HttpError("Could not find a place for the provided id.", 404);
//   }

//   res.json({ place }); // => { place } => { place: place }
// };

// const getPlacesByUserId = (req, res, next) => {
//   const userId = req.params.uid;
//   const places = DUMMY_PLACES.filter((p) => {
//     return p.creator === userId;
//   });

//   if (!places || places.length === 0) {
//     return next(
//       new HttpError("Could not find a place for the provided user id", 404)
//     );
//   }

//   res.json({ places });
// };

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


const createPlace = (req, res) => {
  const { name, image, token } = req.body;
  const {userId}=jwt.decode(token);
  
    console.log({ name, image });

   const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = image.split(';')[0].split('/')[1];

    console.log('decoded part',base64Data);
    
    const slug = slugify(name);
    let newImg = new Image({ name, slug });

    const params = {
      Bucket: "dbimagebucket",
      Key: `Newimages/${uuidv4()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
    };

    console.log('params', params);

    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Upload to s3 failed" });
      }
      console.log("AWS UPLOAD RES DATA", data);
       newImg.image.url = data.Location, 
       newImg.image.key = data.Key;

       console.log('Token ', jwt.decode(token));   
       
       newImg.creator = userId;
                            

       newImg.save((err, success) => {
         if (err) {
          console.log(err);
          res.status(400).json({ error: "Duplicate image" });
        }
         return res.json(success);
       });
    });
};

const list = (req, res) => {
  console.log(req.body);
  const { token } = req.body;
  const { userId } = jwt.decode(token);
  
  Image.find({creator: userId }).exec((err, data) => {
      if (err) {
          return res.status(400).json({
              error: 'Image could not be found'
          });
      }
      console.log('DATA', data);
      res.json(data);
  });
};

exports.createPlace = createPlace;
exports.list = list;
