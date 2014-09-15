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
        console.log(encoding + "..." + file);


        var fstream = fs.createWriteStream("./uploads/" + filename);

        file.pipe(fstream);



        file.on("data", function(chunk) {
            if (!chunk) {
                console.log("fhdsif");
            }

        });
        file.on("end", function() {
            console("error");
        });

        fstream.on("close", function() {
            console("error");
        });
        fstream.on("error", function() {
            console("drain");
        });
    });
    busboy.on("finish", function() {
        console.log("uploaded");
        res.send("file uploaded");
    });
    busboy.on("error", function() {
        console("error");
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
