const getIPAdress = require("./getIPAdress");
const myHost = getIPAdress();
const port = 80;

module.exports = {
    port,
    url: `http://${myHost}:${port}/`
};