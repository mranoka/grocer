const mongoose = require("mongoose");
const User = require("../models/users.model");
const crypto = require("crypto");
const KEY = process.env.KEY;
const HASH_ALGORITHM_TO_USE = crypto.getHashes().find(itemName => itemName === "sha256");
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
        data: "",
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
        users: "",
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
        authStatus: "false",
        user: "",
        ErrorMessage: "Error occured while retrieving records from database",
      });
    } else {
      let passwordHash = crypto
        .createHash(HASH_ALGORITHM_TO_USE, KEY)
        // updating data
        .update(req.body.passWord)
        // Encoding to be used
        .digest("hex");

      let userNameHash = crypto
        .createHash(HASH_ALGORITHM_TO_USE, KEY)
        // updating data
        .update(req.body.userID)
        // Encoding to be used
        .digest("hex");

      let authStatusHash = crypto
        .createHash(HASH_ALGORITHM_TO_USE, KEY)
        // updating data
        .update(userNameHash + process.env.SALT)
        // Encoding to be used
        .digest("hex");

        console.log(passwordHash)
        console.log(KEY)
        console.log(userNameHash + process.env.SALT)
        console.log(authStatusHash)
        console.log(data[0] && data[0].password)
      if (data[0] && data[0].password === passwordHash) {
        res.status(200).send({
          authStatus: authStatusHash,
          user: userNameHash + process.env.SALT,
          ErrorMessage: "",
        });
      } else {
        res
          .status(200)
          .send({ authStatus: "false", user: "", ErrorMessage: "" });
      }
    }
  });
};
