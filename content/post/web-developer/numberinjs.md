---
date: 2019-06-17
lastmod: 2019-06-18
title: "谈谈JavaScript中的Number"
draft: false
tags: ["JavaScript"]
categories: ["JavaScript"]
---

{{< blockquote link="https://developer.mozilla.org/zh-CN/docs/Glossary/Number" >}}
在 JavaScript 中, Number 是一种 定义为 64 位双精度浮点型（double-precision 64-bit floating point format） (IEEE 754)的数字数据类型。
{{< /blockquote >}}

<img src="/images/IEEE_754_Double_Floating_Point_Format.svg">

64 位存储数值，其中 0 到 51 存储数字（片段），52 到 62 存储指数，63 位存储符号：  
其中 IEEE 754 规定，有效数字第一位默认总是 1，不在 64 位浮点数之中，有效数字都是`1.xxxxxx....xxx`形式，小数点后面数最长 52 位。（其实是：科学记数法的二进制表示形式）

## 最大最小整数的取值范围

`[-9007199254740991,9007199254740991]`

```javascript
Math.pow(2, 53) - 1 === Number.MAX_SAFE_INTEGER //es6+
// 9007199254740991
-(Math.pow(2, 53) - 1)) === Number.MIN_SAFE_INTEGER //es6+
// -9007199254740991
```

js 中的整数超过这两个值的任意计算都将失去精度。任意的 js 操作都不会正常显示，例如后端传回超过这两个值的 id 数字末尾都被截取以 0 代替。

解决方案：

- 转换成字符串
- [Long.js](https://github.com/dcodeIO/long.js)

## 0.1+0.2 问题

因为二进制小数位只有 52 位，后面都将被截断（零舍一入），所以相加必然会出现精度丢失问题。

解决方案：

- [math.js](https://mathjs.org/)
- [bignumber.js](https://github.com/MikeMcl/bignumber.js/)

简单实用的高精度计算：

```javascript
//加
function add(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) + mul(b, e)) / e;
}

// 减
function sub(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) - mul(b, e)) / e;
}

//乘
function mul(a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {}
  try {
    c += e.split(".")[1].length;
  } catch (f) {}
  return (
    (Number(d.replace(".", "")) * Number(e.replace(".", ""))) / Math.pow(10, c)
  );
}

//除
function div(a, b) {
  var c,
    d,
    e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {}
  return (
    (c = Number(a.toString().replace(".", ""))),
    (d = Number(b.toString().replace(".", ""))),
    mul(c / d, Math.pow(10, f - e))
  );
}

//四舍五入
function round(num, ratio) {
  var base = Math.pow(10, ratio);
  return div(Math.round(mul(num, base)), base);
}
```

## toFixed 四舍五入问题

```javascript
(1.045).toFixed(2); // "1.04"
(1.65).toFixed(1); // "1.6"
```

解决方案：  
[number-precision](https://github.com/nefe/number-precision)

```javascript
/**
 * 四舍五入
 */
function round(num, ratio) {
  var base = Math.pow(10, ratio);
  return div(Math.round(mul(num, base)), base);
}
```
