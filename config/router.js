"use strict";
var path=require("path");
module.exports = function(app) {
    app.get("/", function(req, res) {
        res.send("hello");
    });
    require("fs").readdirSync("./modules").forEach(function(file) {
        require(path.resolve("./modules/" + file))(app);
    });
};
