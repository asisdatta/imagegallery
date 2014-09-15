"use strict";
var Q = require("q"),
    message = require("../../lib").message;

exports.getImageCount = function(imgModel, workflow) {
    var deffered = Q.defer();
    imgModel.count({},
        function(err, data) {
            if (err) {
                workflow.emit("exception", err);
                deffered.reject();
            } else {
                if (data > 0) {
                    workflow.outcome.data.imageCount = data;
                    deffered.resolve();
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                    deffered.reject();
                }
            }
        });
    return deffered.promise;
};

exports.insertImage = function(name, imgModel, workflow) {
    var deffered = Q.defer();
    new imgModel({
        filename: name
    }).save(function(err, data) {
        if (err) {
            console.log("error in insertion")
            workflow.emit("exception", err);
            deffered.reject();
        } else {
            console.log("inserted succesfully");
            deffered.resolve();
        }
    });
    return deffered.promise;
};

exports.getImageUrls = function(pageNo, noOfImage, imgModel, workflow) {
    var deffered = Q.defer(),
        imagePath = require("../../config/config").imagePath;
    imgModel.find({}, {
        _id: 0
    })
        .skip((pageNo - 1) * noOfImage)
        .limit(noOfImage)
        .exec(function(err, data) {
            if (err) {
                workflow.emit("exception", err);
                deffered.reject();
            } else {
                if (data.length > 0) {
                    workflow.outcome.data.urls = [];
                    for (var i in data) {
                        console.log(data[i].filename);
                        workflow.outcome.data.urls.push(imagePath + data[i].filename);
                    }
                    deffered.resolve();
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                    deffered.reject();
                }
            }
        });
}
