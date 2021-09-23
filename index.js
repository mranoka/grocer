const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
var cors = require('cors')
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');

app.use(cors());

// allow access to req.body object
app.use(express.json()); 

// routes
require('./routes/items.routes').itemsAdd(app);
require('./routes/items.routes').itemsGetById(app);
require('./routes/items.routes').itemsUpdate(app);
require('./routes/items.routes').itemsGetAll(app);
require('./routes/items.routes').deleteItem(app);

// uri for connecting to database from Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fojyg.mongodb.net/grocer?retryWrites=true&w=majority`
mongoose.Promise = global.Promise;

mongoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

mongoose.connection.on('error', function (error) {
    console.log('Connection to Mongo established.');
    console.log('Could not connect to the database Error: ' + error +'\n Exiting now...)');
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
    res.render('error');
});

module.exports = app;




app.listen(PORT, ()=> {
    console.log(`Listening at http://localhost:${PORT}`)
})