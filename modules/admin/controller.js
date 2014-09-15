"use strict";
var lib = require("../../lib"),
    schemas = require("./schema"),
    utility = require("./util"),
    imgModel = schemas.imgModel,
    mongoose = lib.mongoose,
    Puid = lib.puid,
    fs = lib.fs,
    db,
    Q = require("q"),
    Busboy = lib.busboy,
    db = require("../../config/config").db,
    puid = new Puid(true),
    imagePath = require("../../config/config").imagePath;;


mongoose.connect(db);
db = mongoose.connection;

exports.uploadImage = function(req, res) {
    var busboy = new Busboy({
            headers: req.headers
        }),
        workflow = lib.workflow(req, res),
        fstream, name,
        deffered = Q.defer();

    busboy.on("file", function(fieldname, file, filename, encoding, mime) {

        name = puid.generate() + "." + mime.match(/\/(.*)/)[1];
        fstream = fs.createWriteStream("./uploads/" + name);
        workflow.outcome.data = {};
        file.pipe(fstream);

        file.on("data", function(chunk) {
            //console.log(chunk.length);
        });

        file.on("end", function() {
            utility.insertImage(name, imgModel, workflow)
                .then(function() {
                    return utility.getImageCount(imgModel, workflow);
                })
                .done(function() {
                    workflow.outcome.data.url = imagePath + name;
                    workflow.emit("response");
                });
        });

        fstream.on("close", function() {
            console.log("fstream close");
        });
        fstream.on("error", function() {
            fstream.end();
            fs.unlink('./uploads/' + name);
        });
        req.on("close", function(err) {
            fstream.end();
            fs.unlink('./uploads/' + name);
            console.log("req aborted by client");
        });
    });
    busboy.on("finish", function() {
        console.log("busboy on finish");
    });

    req.pipe(busboy);

};

exports.getImages = function(req, res) {
    var pageNo = req.body.pageNo,
        noOfImage = req.body.noOfImage,
        workflow = lib.workflow(req, res),
        message = require("../../lib").message;
    if (pageNo && noOfImage) {
        if (isNaN(pageNo) || isNaN(noOfImage)) {
            workflow.outcome.errfor.message = message.INVALID_DATA_FORMAT;
            workflow.emit("response");
        } else {
            workflow.outcome.data = {};
            Q.all([
                utility.getImageUrls(pageNo, noOfImage, imgModel, workflow),
                utility.getImageCount(imgModel, workflow)
            ]).done(function() {
                workflow.emit("response");
            });
        }
    } else {
        workflow.outcome.errfor.message = message.FIELD_REQUIRED;
        workflow.emit("response");
    }
};
