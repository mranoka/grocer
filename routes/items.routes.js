const items = require("../controllers/items.controller");

exports.itemsAdd = (app) => {
    app.post('/new/item', items.newItems);
}

exports.itemsGetById = (app) => {
    app.get('/item/:id', items.oldItemsById);
}

exports.itemsUpdate = (app) => {
    app.put('/items/month/:id', items.updateItem);
}

exports.itemsGetAll = (app) => {
    app.get('/items/all', items.itemsGetAll);
}

exports.deleteItem = (app) => {
    app.delete('/item', items.deleteItem)
}