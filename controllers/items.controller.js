const mongoose = require("mongoose");
const Item = require("../models/item.model");
mongoose.set("useFindAndModify", false);
const crypto = require("crypto");
const HASH_ALGORITHM_TO_USE = crypto.getHashes().find(itemName => itemName === "sha256");


exports.addNewUserProfile = (req, res) => {
  Item.find({ userName: req.body.userName }, (err, data) => {
    if (err) {
      res.status(400).send({
        data: "",
        ErrorMessage: "Error occured while retrieving records from database",
      });
    } else {
      if (data.length > 0) {
        res.status(200).send({ data: "" });
      } else {
        const passwordHash = crypto
          .createHash(HASH_ALGORITHM_TO_USE, process.env.KEY)
          // updating data
          .update(req.body.passWord)
          // Encoding to be used
          .digest("hex");

        // create new user profile and persist to database
        const newItem = new Item({
          userName: req.body.userName,
          password: passwordHash,
          isAdmin: req.body.isPrivileged,
          lists: req.body.itemLists,
        });

        newItem.save((err, data) => {
          if (err) {
            res.status(400).send({
              data: "",
              ErrorMessage: `Error occured while adding item to database: Item not added. Info: ${err}`,
            });
          } else {
            res.status(200).send({ data: data._id });
          }
        });
      }
    }
  });
};

exports.getAllUserLists = (req, res) => {
  let userNameHash = req.headers.authorization.split(",")[0].replace("6902d29564c05dcd0ce5319a109032a64c98ecefea10811587578396f9edb706","");
  let authHash = req.headers.authorization.split(",")[1];

  let authStatusHash = crypto
  .createHash(HASH_ALGORITHM_TO_USE, process.env.KEY)
  // updating data
  .update(userNameHash + process.env.SALT)
  // Encoding to be used
  .digest("hex");

  if(authHash === authStatusHash) {
    Item.find({ userName: req.params.userId }, (err, data) => {
      if (err) {
        res.status(400).send({
          lists: [],
          userId: "",
          ErrorMessage: "Error occured while retrieving records from database",
        });
      } else {
        res.status(200).send({ lists: data[0]?.lists, userId: data[0]._id });
      }
    });
  } else {
    res.status(200).send({ lists: [], userId: data[0]._id });
  }
};

exports.oldItemsById = (req, res) => {
  Item.find({ _id: req.params.userId }, (err, data) => {
    if (err) {
      res.status(400).send({
        items: [],
        listDate: "",
        ErrorMessage: "Erro occured while retrieving record from database",
      });
    } else {
      let listsArr = data[0].lists;

      for (let i = 0; i < listsArr.length; i++) {
        if (listsArr[i]._id == req.params.listId) {
          res
            .status(200)
            .send({ items: listsArr[i].items, listDate: listsArr[i].listDate });
          break;
        }
      }
    }
  });
};

exports.updateItem = (req, res) => {
  Item.find({ _id: req.params.userId }, (err, data) => {
    if (err) {
      res.status(400).send({
        items: [],
        listDate: "",
        ErrorMessage: "Erro occured while retrieving record from database",
      });
    } else {
      for (let i = 0; i < data[0].lists.length; i++) {
        if (data[0].lists[i]._id == req.params.listId) {
          data[0].lists[i].items = req.body.items;
          break;
        }
      }

      Item.updateOne(
        { _id: req.params.userId },
        { lists: data[0].lists },
        (err, updateStatus) => {
          if (err) {
            res.status(400).send({
              ErrorMessage:
                "Error occured while updating item: Item(s) not added",
              documentsMatched: 0,
              documentsModified: 0,
            });
          } else {
            res.status(200).send({
              documentsMatched: updateStatus.nModified,
              documentsModified: updateStatus.nModified,
            });
          }
        }
      );
    }
  });
};

exports.addNewItemsList = (req, res) => {
  let userItemsArray = [];

  Item.find({ userName: req.body.userId }, (err, data) => {
    if (err) {
      res.status(400).send({
        ErrorMessage:
          "Error occured while updating item: Item(s) not added",
        data: "",
      });
    } else {
      // retrieve all user's item lists
      if (data[0].lists.length > 0) userItemsArray = data[0].lists;

      let newListObj = {
        listDate: req.body.dates,
        items: req.body.items,
      };

      userItemsArray.push(newListObj);

      Item.findOneAndUpdate(
        { userName: req.body.userId },
        { lists: userItemsArray },
        (err, data) => {
          if (err) {
            res.status(400).send({
              data: "",
              ErrorMessage: "Error occured while updating item: Item not added",
            });
          } else {
            // return _id of newly added list
            Item.find({ _id: data._id }, (err, data) => {
              if (err) {
                res.status(400).send({
                  data: "",
                  ErrorMessage:
                    "Error occured while finding item: Item not found",
                });
              } else {
                res.status(200).send({
                  data: data[0].lists[data[0].lists.length - 1],
                });
              }
            });
          }
        }
      );
    }
  });
};

exports.deleteItem = (req, res) => {
  Item.deleteOne({ _id: req.body.id }, (err, data) => {
    if (err) {
      res.status(400).send({
        Error: "Error occured while deleting item: Item not deleted",
        itemsDeleted: 0,
      });
    } else {
      res.status(400).send({ itemsDeleted: data.deletedCount });
    }
  });
};
