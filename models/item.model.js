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

const itemsParentSchema = mongoose.Schema({
  listDate: {
    type: String,
    required: true,
  },
  items: [itemsChildSchema],
});

module.exports = mongoose.model("grocer", itemsParentSchema, "Items");
