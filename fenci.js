var nodejieba = require("nodejieba");
var result = nodejieba.cut("南京市长江大桥");
console.log(result);
var topN = 40;
var title = "创星 3219  17/19/22/24英寸平板液晶电视  支持机顶盒 HDMI 电视机 底座+挂架+高清线 22英寸USB窄边";
console.log(nodejieba.extract(title, topN));
console.log(nodejieba.cut(title));
