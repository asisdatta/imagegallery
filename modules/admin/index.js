"use strict";

module.exports = function(app) {
    var user = require('./controller'),
        bodyParser = require("body-parser");

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.post("/upload", user.uploadImage);
    app.post("/getimages",user.getImages);
};


