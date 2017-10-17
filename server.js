var http = require("http");
var url = require("url");
var fs = require("fs");
var server = http.createServer(function (request, response) {
    //->解析客户端请求的URL地址
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname,
        query = urlObj.query;

    //->如果客户端请求的是静态的资源文件(HTML/CSS/JS/图片/音视频...),我们把文件中的内容获取到,并且返回给客户端进行渲染
    var reg = /\.(HTML|JS|CSS)/i;
    if (reg.test(pathname)) {
        //->获取请求文件的后缀名
        var suffix = reg.exec(pathname)[1].toUpperCase();

        //->根据后缀名获取MIME的类型
        var suffixType = "text/plain";
        switch (suffix) {
            case "HTML":
                suffixType = "text/html";
                break;
            case "JS":
                suffixType = "text/javascript";
                break;
            case "CSS":
                suffixType = "text/css";
                break;
        }

        //->读取对应文件中的代码,并且返回给客户端
        var conFile = fs.readFileSync("." + pathname, "utf8");
        response.writeHead(200, {'content-type': suffixType + ";charset=utf-8;"});
        response.end(conFile);
        return;
    }
//->获取全部的数据
    var con = fs.readFileSync("./json/student.json", "utf8");
    con = JSON.parse(con);
    //->编写数据请求的接口:/getData?n=2 n是当前页 ->首先把n获取到,读取page.json中的全部内容,然后把n这一页对应的那10条数据都获取到
    if (pathname === "/getData") {
        var n = query["n"];
        console.log(con.length);
        //->在全部的数据中把n这一页对应的数据获取到
        var ary = [];
        for (var i = (n - 1) * 10; i <= n * 10 - 1; i++) {
            //  如果大于最后一个数据，跳出
            if (i > con.length - 1) {
                break;
            }
            var curData = con[i];
            ary.push(curData);
        }

        //->把获取的数据返回给客户端
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify({
            code: 0,
            msg: "成功",
            //  获取总数据分页
            total: Math.ceil(con.length / 10),
            data: ary
        }));
        return;
    }
    if (pathname === "/getInfo") {
        var studentId = query["id"];
        var res = {
            code: 1,
            msg: "内容不存在",
            data: null
        };
        for (var i = 0; i < con.length; i++) {
            if (con[i]["id"] == studentId) {
                res = {
                    code: 0,
                    msg: "成功",
                    data: con[i]
                };
                break;
            }
        }
        //->把获取的数据返回给客户端
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify(res));
        return;
    }
    response.writeHead(404);
    response.end("request api url is not found~~~");
});
server.listen(65534, function () {
    console.log("当前服务已经启动,正在监听65534端口!");
});