const multiparty = require("multiparty");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const app =  express();
const fs = require("fs");
const chokidar = require("chokidar");
const httpUrl = require("./util/getHttpUrl");
const formatSize = require("./static/formatSize");
const e = require("express");
function resolvePath (dir) {
    return path.join(__dirname, dir);
};


//创建服务器使用的
const httpServer = require("http").createServer(app);
//socket 负责全双工通信
const options = { /* ... */ };
const IO = require("socket.io")(httpServer, options);


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

IO.on("connection", function(socket) {
    socket.on("client", function (data) {
        console.log(data);
    });
    socket.on("disconnect", function () {
        console.log("socket 成功断开！");
    });
    // setTimeout(() => {
    //     socket.emit("message", "消息更新")
    // }, 3000);
    chokidar.watch(resolvePath("download"), {
        ignored: /download.html/,
        ignoreInitial: true,
    }).on("all", (event, path) => {
        if ( event === "change" || event === "add" || event === "unlink" ) {
            try {
                socket.emit("new", {
                    code: 0,
                    message: "文件变动!"
                });
            } catch (error) {
                console.error(error);
            }
        }
    });
    console.log("socket 连接成功！");
});


httpServer.listen(httpUrl.port, function () {
    console.log(`please open link: ${httpUrl.url}`);
});
