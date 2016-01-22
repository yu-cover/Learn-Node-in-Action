var http = require('http');

var fs = require('fs');

var path = require('path');

var mime = require('mime');

//用来缓存文件内容
var cache = {};

function send404(res){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: resource not found');
    res.end();
}

function sendFile(res, filePath, fileContents){
    res.writeHead(200, {
        'Content-Type': mime.lookup(path.basename(filePath))
    });
    res.end(fileContents);
}

/*访问内存（RAM）要比访问文件系统快得多，所以Node程序通常会把常用的数据缓存到内存里。
我们的聊天程序就要把静态文件缓存到内存中，只有第一次访问的时候才会从文件系统中读取。*/

function serveStatic(res, cache, absPath){
    if(cache[absPath]){
        sendFile(res, absPath, cache[absPath]);
    }else{
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath, function(err, data){
                    if(err){
                        send404(res);
                    }else{
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            }else{
                send404(res);
            }
            
        });
    }
}

var server = http.createServer(function(req, res){
    var filePath = false;

    if(req.url == '/'){
        filePath = 'public/index.html';
    }else{
        filePath = 'public'+ req.url;
    }

    var absPath = './'+ filePath;
    serveStatic(res, cache, absPath);
});
server.listen(2000, function(){
    console.log('server listen in 2000');
});