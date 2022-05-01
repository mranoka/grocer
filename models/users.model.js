const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfCreation: {
        type: String,
        required: true,
    }
  });
  
  module.exports = mongoose.model( "user", usersSchema, "userList");