const mongoose = require("mongoose");
const Item = require("../models/item.model");
mongoose.set("useFindAndModify", false);
const crypto = require("crypto");

exports.addNewUserProfile = (req, res) => {

  let hashAlgorithmToUse = crypto.getHashes()[4];
  const secret = "mayTheForceBeWithYouTheySaid";

  const passwordHash = crypto
    .createHash(hashAlgorithmToUse, secret)
    // updating data
    .update(req.body.passWord)
    // Encoding to be used
    .digest("hex");

  // create new user profile and persist to database
  const newItem = new Item({
    userName: req.body.userName,
    password: passwordHash,
    isAdmin: req.body.isPrivileged,
    lists: req.body.itemLists
  });

  newItem.save((err, data) => {
    if (err) {
      res
        .status(400)
        .send({
          ErrorMessage:
            `Error occured while adding item to database: Item not added. Info: ${err}`,
        });
    } else {
      res.status(200).send({ data: data._id });
    }
  });
};

exports.getAllUserItems = (req, res) => {
    Item.find({userName: req.params.userId}, (err, data) => {
        if (err) {
            res
              .status(400)
              .send({
                ErrorMessage: "Error occured while retrieving records from database",
              });
          } else {
            res.status(200).send({ items: data.lists });
          }
    })
}


exports.oldItemsById = (req, res) => {
  Item.find({ _id: req.params.id }, (err, data) => {
    if (err) {
      res
        .status(400)
        .send({
          ErrorMessage: "Error occured while retrieving record from database",
        });
    } else {
      res.status(200).send({ item: data });
    }
  });
};

exports.updateItem = (req, res) => {
  Item.updateOne(
    { _id: req.params.id },
    { items: req.body.items },
    (err, data) => {
      if (err) {
        res
          .status(400)
          .send({
            ErrorMessage: "Error occured while updating item: Item not added",
          });
      } else {
        res
          .status(200)
          .send({
            documentsMatched: data.nModified,
            documentsModified: data.nModified,
          });
      }
    }
  );
};

exports.addNewItemsList = (req, res) => {
  Item.updateOne(
    { userName: req.body.id },
    { lists: req.body.items },
    (err, data) => {
      if (err) {
        res
          .status(400)
          .send({
            ErrorMessage: "Error occured while updating item: Item not added",
          });
      } else {
        res
          .status(200)
          .send({
            documentsMatched: data.nModified,
            documentsModified: data.nModified,
          });
      }
    }
  );
};

exports.deleteItem = (req, res) => {
    Item.deleteOne({_id: req.body.id}, (err, data) => {
        if (err) {
            res.status(400).send({Error: "Error occured while deleting item: Item not deleted",
                                  itemsDeleted: 0});
        } else {
            res.status(400).send({itemsDeleted: data.deletedCount});
        }
    })
}
