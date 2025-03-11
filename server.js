const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const WebFile = require("./functions/webfile.js");

function app(req, res) {
  const reqWebFile = new WebFile(req.url);
  if (fs.existsSync(reqWebFile.reqResource)) {
    res.writeHead(200, { "Content-Type": reqWebFile.getMimeType() });
    res.write(fs.readFileSync(reqWebFile.reqResource));
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write(fs.readFileSync(reqWebFile.error));
  }

  res.end();
}

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port);

console.log(`Your local server is now running: ` + `http:localhost:${port}`);
