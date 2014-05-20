var url = require("url");
var http = require("http");
var connect = require('connect');
var serveStatic = require("serve-static");
var multipart = require("connect-multiparty");
var client = connect();
var server = connect();

client.use(serveStatic("public"));
server.use(multipart());
server.use(function(req, res) {
  console.log(req.body);
  var redirect = req.body.rurl;
  if (redirect) {
    res.writeHead(302, {
      'Location': redirect + "?callback=" + req.body.callback + "&data={test:'hello world'}"
    });
    console.log("redirecting to " + redirect);
    res.end();
  }
  else {
    res.end("A param indicating where to redirect is required.");
  }
});

client.listen(3000);
server.listen(3001);
console.log("client listening on 3000");
console.log("server listening on 3001");
console.log("Modify your hosts file for a nice way to cross-domain test.");
