function getRandom(n, m) {
    return Math.round(Math.random() * (m - n) + n);
}
var str1 = "赵钱孙李周吴郑王刘杨朱徐屈张孔江";
var str2 = "一二三四五六七八九壹贰叁肆伍陆柒捌玖";



var ary = [];
for (var i = 1; i<= 10000; i++) {
    var obj = {};
    obj['id'] = i;
    obj['name'] = str1[getRandom(0,15)] + str2[getRandom(0,17)];
    obj["sex"] = getRandom(0,1);
    obj["score"] = getRandom(50,99);
    ary.push(obj);
}
var fs = require("fs");
fs.writeFileSync("./student.json",JSON.stringify(ary),"utf-8");