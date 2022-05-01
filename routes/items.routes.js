const items = require("../controllers/items.controller");

exports.itemsAdd = (app) => {
    app.post('/new/userprofile', items.addNewUserProfile);
}

exports.itemsGetById = (app) => {
    app.get('/item/:id', items.oldItemsById);
}

exports.itemsUpdate = (app) => {
    app.put('/items/month/:id', items.updateItem);
}

exports.getUserItems = (app) => {
    app.get('/items/all/:userId', items.getAllUserItems);
}

exports.deleteItem = (app) => {
    app.delete('/item', items.deleteItem)
}

exports.addListItems = (app) => {
    app.put("/add/list", items.addNewItemsList)
}
