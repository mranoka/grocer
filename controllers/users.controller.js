const mongoose = require("mongoose");
const User = require("../models/users.model");
const crypto = require("crypto");
const KEY = process.env.KEY;
const HASH_ALGORITHM_TO_USE = crypto.getHashes().find(itemName => itemName === "sha256");


exports.newUser = async (req, res) => {
  try {
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

  let savedUserProfile = await newUserProfile.save();

  if(savedUserProfile) {
    res.status(200).send({ data: savedUserProfile._id });
  } else {
    res.status(400).send({
      data: null,
      ErrorMessage: `Error occured while adding user to database: user not added. Info: ${err}`,
    });
  }
  } catch(error) {
    res.status(400).send({
      data: null,
      ErrorMessage: `Error occured while adding user to database: user not added. Info: ${err}`,
    });
  }
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

exports.authenticateUser = async (req, res) => {
  try {
    let response = await User.find({ userName: req.body.userID }).exec();
      if (response.length == 0) {
        console.log("wrong")
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
          
        if (response[0].password === passwordHash) {
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
  } catch(error) {
    console.log(error)
          res.status(400).send({
        authStatus: "false",
        user: "",
        ErrorMessage: "Error occured while retrieving records from database",
      });
  }
};
