var imgModel = require("./modules/admin/schema").imgModel,
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/imagegallery");
db = mongoose.connection;

/*imgModel.count({},
    function(err, data) {
        if (err) {
            console.log("error");
        } else {
            if (data > 0) {
                console.log("count ", data);
            } else {
                console.log("no data");
            }
        }
    });*/

imgModel.find({}, {_id: 0})
    .skip(0)
    .limit(3)
    .exec(function(err, data) {
        if (err) {
            console.log("error");

        } else {
            if (data.length > 0) {
                for (i in data) {
                    console.log(data[i].filename);
                }
            } else {
                console.log("no data");
            }
        }
    });
