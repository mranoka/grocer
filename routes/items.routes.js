const items = require("../controllers/items.controller");

exports.addUserProfile = (app) => {
    app.post('/new/userprofile', items.addNewUserProfile);
}

exports.addNewUserList = (app) => {
    app.put('/new/list', items.addNewItemsList);
}

exports.itemsGetById = (app) => {
    app.get('/item/:userId/:listId', items.oldItemsById);
}

exports.itemsUpdate = (app) => {
    app.put('/items/month/:userId/:listId', items.updateItem);
}

exports.getUserItems = (app) => {
    app.get('/items/all/:userId', items.getAllUserLists);
}

exports.deleteItem = (app) => {
    app.delete('/item', items.deleteItem)
}
