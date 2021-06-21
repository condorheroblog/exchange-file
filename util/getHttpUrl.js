const getIPAdress = require("./getIPAdress");
const myHost = getIPAdress();
const port = 8848;

module.exports = {
    port,
    url: `http://${myHost}:${port}/`
};
