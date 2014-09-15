"use strict";
var lib = require("../../lib"),
    schemas = require("./schema"),
    utility = require("./util"),
    imgModel = schemas.imgModel,
    mongoose = lib.mongoose,
    Puid = lib.puid,
    fs=lib.fs,
    db,
    Q = require("q"),
    Busboy = lib.busboy,
    db = require("../../config/config").db,
    puid = new Puid(true);


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
        
        name=puid.generate()+"."+mime.match(/\/(.*)/)[1];
        fstream = fs.createWriteStream("./uploads/" +name);
        workflow.outcome.data={};
        file.pipe(fstream);

        file.on("data", function(chunk) {
            //console.log(chunk.length);
        });

        file.on("end", function() {
            utility.insertImage(name, imgModel, workflow)
                .then(function() {
                    var deffered = Q.defer();
                    utility.getImageCount(imgModel, workflow,deffered);
                    return deffered.promise;
                })
                .done(function() {
                    workflow.emit("response");
                });
        });

        fstream.on("close", function() {
            console.log("fstream close");
        });
        fstream.on("error", function() {
            console.log("fstream error");
        });
    });
    busboy.on("finish", function() {
        console.log("finish");
        console.log(workflow.outcome.data);
    });

    req.pipe(busboy);

};
