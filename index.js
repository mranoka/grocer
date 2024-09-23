const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
var cors = require('cors')
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const path = require('path');

app.use(cors());

// allow access to req.body object
app.use(express.json()); 

// routes
require('./routes/items.routes').addUserProfile(app);
require('./routes/items.routes').itemsGetById(app);
require('./routes/items.routes').itemsUpdate(app);
require('./routes/items.routes').getUserItems(app);
require('./routes/items.routes').deleteItem(app);
require('./routes/items.routes').addNewUserList(app);
require('./routes/users.routes').addNewUser(app);
require('./routes/users.routes').getAllUsers(app);
require('./routes/users.routes').authenticateUser(app);

// uri for connecting to database from Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fojyg.mongodb.net/grocer?retryWrites=true&w=majority`
mongoose.Promise = global.Promise;

mongoose.connect(uri);

mongoose.connection.on('error', function (error) {
    console.log('Could not connect to the database. ' + error +'\n Exiting now...)');
    process.exit();
});

mongoose.connection.once('open', function () {
    console.log("Successfully connected to the database");
})


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({"error": err});
});

module.exports = app;

// serve status assets if in production
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}


app.listen(PORT, ()=> {
    console.log(`Listening at http://localhost:${PORT}`)
})

//"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
