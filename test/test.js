 'use strict';
 var formidable = require('formidable'),
     http = require('http'),
     util = require('util'),
     fs = require('fs'),
     path = require("path");

 http.createServer(function(req, res) {
     //console.log("ok");
     if (req.url == '/upload' && req.method == 'POST') {
         // parse a file upload
         var form = new formidable.IncomingForm();

         form.parse(req, function(err, fields, files) {
             res.writeHead(200, {
                 'content-type': 'text/plain'
             });
             //console.log(fields,files);        
             console.log(Object.keys(files));
             fs.readFile(files.image.path, function(err, data) {
                 var newPath = "./uploads/" + files.image.name;
                 fs.writeFile(newPath, data, function(err) {
                     console.log("done", files.image.name);
                     res.end("OK");
                 });
             });
             console.log(fields, files);
         });

         return;
     }

     // show a file upload form
     res.writeHead(200, {
         'content-type': 'text/html'
     });
     res.end(
         '<form action="/upload" enctype="multipart/form-data" method="post">' +
         '<input type="file" name="image" multiple="multiple"><br>' +
         '<input type="submit" value="Upload">' +
         '</form>'
     );
 }).listen(8080);
