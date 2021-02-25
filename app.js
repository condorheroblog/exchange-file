const multiparty = require("multiparty");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const app =  express();
const fs = require("fs");
const httpUrl = require("./util/getHttpUrl");
const formatSize = require("./static/formatSize");
function resolvePath (dir) {
    return path.join(__dirname, dir);
};


app.use(express.static(resolvePath("/download")));
app.use(express.static(resolvePath("/public")));
app.use("/static", express.static(resolvePath("/static")));
// https://expressjs.com/en/4x/api.html#req.body
app.use(bodyParser.json({ limit: "5000mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// 上传接口
app.post("/upload", function (req, res) {
    const form = new multiparty.Form({ uploadDir: "upload" });
    form.parse(req);
    form.on("file", function(name, file) {
        const { path, originalFilename } = file;
        fs.renameSync(path, `upload/${originalFilename}`);
        res.json({
            url: `http://localhost:48488/${originalFilename}`,
            message: "发送成功"
        });
    })
});

// 下载列表接口
function getFileList () {
    let downloadList = [];
    const filesArr = fs.readdirSync(resolvePath("download"));
    filesArr.forEach(fileName => {
        if (fileName === "download.html") {
            return;
        }
        const relPath = resolvePath(`download/${fileName}`);
        const stat = fs.statSync(relPath);
        if (!stat.isDirectory()) {
            downloadList.push({
                fileName,
                fileSize: formatSize(stat.size),
                downloadUrl: `${httpUrl.url}${fileName}`
            })
        }
    });

    return downloadList;
}

app.get("/download-list", function (req, res) {
    const downloadList = getFileList();
    res.json({
        downloadList,
        code: 0,
        message: "请求成功"
    });
});


app.listen(httpUrl.port, function () {
    console.log(`please open link: ${httpUrl.url}`);
});
