var express = require('express'),
    fs = require("fs"),
    Busboy = require('busboy');

app = express();
app.listen(7000);

app.get("/", display_form);

app.post("/upload", function(req, res) {

    var busboy = new Busboy({
        headers: req.headers
    });
    busboy.on('file', function(fieldname, file, filename, encoding, mime) {
        var fstream = fs.createWriteStream("./uploads/" + filename);
        file.pipe(fstream);
        file.on("data", function(chunk) {
            //console.log(chunk.length);
        });
        file.on("end", function() {
            console.log("end");
        });

        fstream.on("close", function() {
            //fstream.end();
            console.log("fstream close");
        });
        fstream.on("error", function() {
            console.log("fstream error ");
        });
        req.on("close", function(err) {
            fstream.end();
            fs.unlink('./uploads/' + filename, function(err) {
                if (err) {
                    throw err;
                }
            });
            console.log("req aborted : " + err);
        });
    });
    busboy.on("finish", function() {
        console.log("uploaded");
        res.send("file uploaded");
    });
    busboy.on("error", function() {
        console("error busboy");
    });

    req.pipe(busboy);

});

function display_form(req, res) {
    res.send(
        '<form action="/upload" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="displayImage">' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
}


function show_404(req, res) {
    res.sendBody('You r doing it rong!');
}
