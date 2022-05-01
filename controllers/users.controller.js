const mongoose = require("mongoose");
const User = require("../models/users.model");
const crypto = require("crypto");
mongoose.set("useFindAndModify", false);

exports.newUser = (req, res) => {
  let hashAlgorithmToUse = crypto.getHashes()[4];
  const secret = "mayTheForceBeWithYouTheySaid";

  const passwordHash = crypto
    .createHash(hashAlgorithmToUse, secret)
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
