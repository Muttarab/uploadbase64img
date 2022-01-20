const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3001;
const fs = require('fs');
const mime = require('mime');

app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(bodyParser.json());

uploadImage = async (req, res, next) => {
    var matches = req.body.base64image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = {};
    if (matches.length !== 3) {
    return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.extension(type);
    let fileName = "image." + extension;
    try {
    fs.writeFileSync("./images/" + fileName, imageBuffer, 'utf8');
    return res.send({"status":"success"});
    } catch (e) {
    next(e);
    }
}

app.post('/upload/image', uploadImage);
app.listen(port, () => console.log(`Server is listening on port ${port}`));