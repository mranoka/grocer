const mongoose = require("mongoose");
const User = require("../models/users.model");
const crypto = require("crypto");
const KEY = "mayTheForceBeWithYouTheySaid";
const HASH_ALGORITHM_TO_USE = crypto.getHashes()[4];
mongoose.set("useFindAndModify", false);

exports.newUser = (req, res) => {
  const passwordHash = crypto
    .createHash(HASH_ALGORITHM_TO_USE, KEY)
    // updating data
    .update(req.body.passWord)
    // Encoding to be used
    .digest("hex");

  //create new user and persist to database
  const newUserProfile = new User({
    userName: req.body.userName,
    password: passwordHash,
    dateOfCreation: req.body.creationDate,
  });

  newUserProfile.save((err, data) => {
    if (err) {
      res.status(400).send({
        ErrorMessage: `Error occured while adding user to database: user not added. Info: ${err}`,
      });
    } else {
      res.status(200).send({ data: data._id });
    }
  });
};

exports.retrieveAllUsers = (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      res.status(400).send({
        ErrorMessage: "Error occured while retrieving records from database",
      });
    } else {
      res.status(200).send({ users: data });
    }
  });
};

exports.authenticateUser = (req, res) => {
  User.find({ userName: req.body.userID }, (err, data) => {
    if (err) {
      res.status(400).send({
        ErrorMessage: "Error occured while retrieving records from database",
      });
    } else {
      const passwordHash = crypto
        .createHash(HASH_ALGORITHM_TO_USE, KEY)
        // updating data
        .update(req.body.passWord)
        // Encoding to be used
        .digest("hex");

      if (data[0] && data[0].password === passwordHash) {
        console.log(req.body.userID + req.body.passWord);
        res.status(200).send({ authStatus: true });
      } else {
        res.status(200).send({ authStatus: false });
      }
    }
  });
};
