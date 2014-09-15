"use strict";
var lib = require('../../lib'),
    mongoose = lib.mongoose,
    Schema = mongoose.Schema,
    imgSchema;
//schema for images collection
imgSchema = new Schema({
    filename: {
        type: String,
        require: true
    }
}, {
    versionKey: false
});

exports.imgModel = mongoose.model("images", imgSchema);
