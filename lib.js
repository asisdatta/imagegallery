"use strict";

module.exports = {
    workflow: require("./config/workflow"), //Acquiring base and exporting it as base
    config: require("./config/config"), //Acquiring config and exporting it as config
    express: require("express"), //Acquiring express and exporting it as express
    mongoose: require("mongoose"), //Acquiring mongoose and exporting it as mongoose
    busboy : require("busboy"),//Acquiring busboy and exporting it as busboy
    puid : require('puid'),//Acquiring puid and exporting it as puid
    message: require("./lang/en"), //Acquiring message and exporting it as message,
    fs:require("fs")
};
