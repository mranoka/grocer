const mongoose = require("mongoose");
const Item = require("../models/item.model");
mongoose.set("useFindAndModify", false);

exports.newItems = (req, res) => {
  // create new document and persist to database
  const newItem = new Item({
    listDate: req.body.dates,
    items: req.body.items,
  });

  newItem.save((err, data) => {
    if (err) {
      res
        .status(400)
        .send({
          ErrorMessage:
            `Error occured while adding item to database: Item not added: ${err}`,
        });
    } else {
      res.status(200).send({ data: data._id });
    }
  });
};

exports.itemsGetAll = (req, res) => {
    Item.find({}, (err, data) => {
        if (err) {
            res
              .status(400)
              .send({
                ErrorMessage: "Error occured while retrieving records from database",
              });
          } else {
            res.status(200).send({ items: data });
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
