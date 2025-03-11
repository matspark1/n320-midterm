const path = require("path");
const mime = require("mime-types");

class WebFile {
  reqDetails = {};
  reqUrl = {};
  reqResource = "";

  error = path.join(__dirname, "../views/404.html");

  constructor(reqUrl) {
    this.reqUrl = reqUrl;
    this.reqDetails = path.parse(reqUrl);

    const reqResourcePath = path.join(__dirname, "../views", reqUrl);
    if (this.reqDetails.ext) {
      this.reqResource = reqResourcePath;
    } else if (this.reqDetails.base) {
      this.reqResource = reqResourcePath + ".html";
    } else {
      this.reqResource = reqResourcePath + "index.html";
    }
  }

  getMimeType() {
    const reqExt = this.reqResource;

    return mime.lookup(reqExt) || "text/plain";
  }
}

module.exports = WebFile;
