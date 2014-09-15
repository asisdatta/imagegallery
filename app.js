"use strict";

/**
 * Module dependencies.
 */

var express = require("./lib").express,
    router = require("./config/router"),
    server = require("./config/config").server,
    app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});
app.use("/uploads",express.static("./uploads"));
router(app);
app.listen(server.port, server.host);


// Caught unhandled exceptions in different processes
/*process.on('uncaughtException', function(err) {
    console.log("Uncaught Exception", err.stack);
});*/

//Configure allowCrossDomain option


