const mongoose = require("mongoose");

const itemsChildSchema = mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
  },
  uuid: {
    type: String,
  },
});

const listsChildSchema = mongoose.Schema({
  listDate: {
    type: String,
    required: true,
  },
  items: [itemsChildSchema],
});

const usersParentSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  lists: [listsChildSchema],
});

module.exports = mongoose.model("grocer", usersParentSchema, "Items");
