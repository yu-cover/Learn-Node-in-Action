var http = require("http");
var server = http.createServer();
var fs = require('fs');
server.on("request", function(req, res){
	res.writeHead(200, {'Content-type': 'text/plain'});
	fs.createReadStream('./qr-stu.png').pipe(res);
	//res.end('your request url:'+ req.url);
});

server.listen(2000, function(){
	console.log("server in 2000");
});

var stream = fs.createReadStream('./json.json');
stream.on('data', function(chunk){
	console.log(chunk);
});

stream.on('end', function(){
	console.log('finished');
});