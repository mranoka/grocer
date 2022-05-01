const users = require("../controllers/users.controller");

exports.addNewUser = (app) => {
    app.post('/new/user', users.newUser)
}

exports.getAllUsers = (app) => {
    app.get('/users/all', users.retrieveAllUsers)
}