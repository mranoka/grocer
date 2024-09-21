const mongoose = require("mongoose");
const Item = require("../models/item.model");
const crypto = require("crypto");
const HASH_ALGORITHM_TO_USE = crypto
  .getHashes()
  .find((itemName) => itemName === "sha256");

exports.addNewUserProfile = async (req, res) => {
  try {
    let result = await Item.find({ userName: req.body.userName }).exec();
    if (result.length > 0) {
      res.status(200).send({
        data: "",
        ErrorMessage: "User already exists",
      });
    } else if (result.length == 0) {
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

      let savedUserProfile = await newItem.save();
      if (savedUserProfile) {
        res.status(200).send({ data: "200 ok" });
      } else {
        res.status(400).send({
          data: null,
          ErrorMessage: `Error occured while adding item to database: User not added`,
        });
      }
    } else {
      res.status(400).send({
        data: null,
        ErrorMessage:
          "Error occured while adding item to database: User not added",
      });
    }
  } catch (error) {
    res.status(400).send({
      data: null,
      ErrorMessage:
        "Error occured while adding item to database: User not added",
    });
  }
};

exports.getAllUserLists = async (req, res) => {
  try {
    let response = await Item.find({ userName: req.params.userId }).exec();
    if (response.length == 0) {
      res.status(400).send({
        lists: [],
        userId: "",
        ErrorMessage: "Error occured while retrieving records from database",
      });
    } else {
      res
        .status(200)
        .send({ lists: response[0].lists, userId: response[0]._id });
    }
  } catch (error) {
    res.status(400).send({ lists: [], userId: "unknown user 404" });
  }
};

exports.oldItemsById = async (req, res) => {
  try {
    let result = await Item.find({ _id: req.params.userId }).exec();

    if (result.length == 0) {
      res.status(400).send({
        items: [],
        listDate: "",
        ErrorMessage: "Erro occured while retrieving record from database",
      });
    } else {
      let listsArr = result[0].lists;

      for (let i = 0; i < listsArr.length; i++) {
        if (listsArr[i]._id == req.params.listId) {
          res
            .status(200)
            .send({ items: listsArr[i].items, listDate: listsArr[i].listDate });
          break;
        }
      }
    }
  } catch (error) {
    res.status(400).send({
      items: [],
      listDate: "",
      ErrorMessage: "Erro occured while retrieving record from database",
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    let result = await Item.find({ _id: req.params.userId }).exec();

    if (result.length == 0) {
      res.status(400).send({
        items: [],
        listDate: "",
        ErrorMessage: "Erro occured while retrieving record from database",
      });
    } else {
      for (let i = 0; i < result[0].lists.length; i++) {
        if (result[0].lists[i]._id == req.params.listId) {
          result[0].lists[i].items = req.body.items;
          break;
        }
      }
      let updateResonse = await Item.updateOne(
        { _id: req.params.userId },
        { lists: result[0].lists }
      ).exec();

      if (updateResonse.acknowledged) {
        res.status(200).send({
          documentsMatched: updateResonse.matchedCount,
          documentsModified: updateResonse.modifiedCount,
        });
      } else {
        res.status(400).send({
          ErrorMessage: "Error occured while updating item: Item(s) not added",
          documentsMatched: 0,
          documentsModified: 0,
        });
      }
    }
  } catch (error) {
    res.status(400).send({
      items: [],
      listDate: "",
      ErrorMessage: "Erro occured while retrieving record from database",
    });
  }
};

exports.addNewItemsList = async (req, res) => {
  try {
    let userItemsArray = [];

    let result = await Item.find({ userName: req.body.userId }).exec();

    if (result.length == 0) {
      res.status(400).send({
        ErrorMessage: "Error occured while updating item: Item(s) not added",
        data: "",
      });
    } else {
      // retrieve all user's item lists
      if (result[0].lists.length > 0) userItemsArray = result[0].lists;

      let newListObj = {
        listDate: req.body.dates,
        items: req.body.items,
      };

      userItemsArray.push(newListObj);

      var resultData = await Item.findOneAndUpdate(
        { userName: req.body.userId },
        { lists: userItemsArray }
      ).exec();

      if(resultData) {
        let listData = await Item.find({ userName: req.body.userId }).exec();
        res.status(200).send({
          data: listData[0].lists[listData[0].lists.length - 1],
        });
      }


    }
  } catch (error) {
    res.status(402).send({
      ErrorMessage: "Error occured while updating item: Item(s) not added " + error,
      data: "",
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    let result = await Item.deleteOne({ _id: req.body.id });
    if (result.ok != 1) {
      res.status(400).send({
        Error: "Error occured while deleting item: Item not deleted",
        itemsDeleted: 0,
      });
    } else {
      res.status(400).send({ itemsDeleted: result.deletedCount });
    }
  } catch (error) {
    res.status(400).send({
      Error: `Error occured while deleting item: Item not deleted: ${error}`,
      itemsDeleted: 0,
    });
  }
};
