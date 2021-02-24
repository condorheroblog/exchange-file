const multiparty = require("multiparty");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const app =  express();
const fs = require("fs");
const getIPAdress = require("./util/getIPAdress");
function resolvePath (dir) {
    return path.join(__dirname, dir);
};


app.use(express.static(resolvePath("/download")));
app.use(express.static(resolvePath("/public")));
app.use("/static", express.static(resolvePath("/static")));
// https://expressjs.com/en/4x/api.html#req.body
app.use(bodyParser.json({ limit: "5000mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/upload", function (req, res) {
    const form = new multiparty.Form({ uploadDir: "upload" });
    form.parse(req);
    form.on("file", function(name, file) {
        console.log(name, file)
        const { path, originalFilename } = file;
        fs.renameSync(path, `upload/${originalFilename}`);
        res.json({
            url: `http://localhost:48488/${originalFilename}`,
            message: "发送成功"
        });
    })
});

const myHost = getIPAdress();
const port = 80;
app.listen(port, function () {
    console.log(`please open link: http://${myHost}:${port}/`);
});
