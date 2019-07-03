---
date: 2019-06-19
lastmod: 2019-06-19
title: "html5中的httpClient"
draft: false
tags: ["html5", "JavaScript"]
categories: ["html5", "JavaScript"]
---

> html5 中的 httpClient 目前只有两种：`ajax`、`fetch`。兼容性如下：

{{< caniuse feature="xhr2" >}}
{{< caniuse feature="fetch" >}}

## ajax

{{< blockquote link="https://zh.wikipedia.org/wiki/AJAX" >}}
AJAX 即“Asynchronous JavaScript and XML”（异步的 JavaScript 与 XML 技术），指的是一套综合了多项技术的浏览器端网页开发技术。
{{< /blockquote >}}

```javascript
// xhr level2
var xhr = new XMLHttpRequest();
xhr.open("GET/POST/DELETE/...", "/url", "async: true | false");
xhr.send();

// 超时时间，0表示永不超时
xhr.timeout = 0;
// 接受数据类型
xhr.responseType = "arrayBuffer | blob | json...";
// 设置请求头
xhr.setRequestHeader("", "");
// 请求成功
xhr.onload = e => {
  console.log("request success");
};
// 请求结束
xhr.onloadend = e => {
  console.log("request loadend");
};
// 请求出错
xhr.onerror = e => {
  console.log("request error");
};
// 请求超时
xhr.ontimeout = e => {
  console.log("request timeout");
};
// 监听进度
xhr.addEventListener(
  "progress",
  function(evt) {
    if (evt.lengthComputable) {
      var percentComplete = evt.loaded / evt.total;
    }
  },
  false
);
```

```html
<!-- post method requeset by xhr -->
<!-- application/x-www-form-urlencoded -->
<form id='test-form'>
  Input1: <input name='input1'><br>
  Input2: <input name='input2'><br>
  <input type='submit'>
</form>
<script>
  var testForm = document.getElementById('test-form');
  testForm.onsubmit = function(event) {
    event.preventDefault();

    var request = new XMLHttpRequest();
    // POST to httpbin which returns the POST data as JSON
    request.open('POST', 'URL', /* async = */ false);

    var formData = new FormData(document.getElementById('test-form'));
    request.send(formData);

    console.log(request.response);
  }
```

原生 xhr 用起来不方便，常见的封装使用：

### jquery ajax

```javascript
/*
* default contentType : application/x-www-form-urlencoded;charset=utf-8
* submit data by json format
*/
$.ajax({
  url:url,
  type:"POST",
  contentType: "application/json; charset=utf-8"
  data:{a:"1"},
  success: function(){
    ...
  }
})

/*
* formData 上传文件
* submit data by multipart/form-data
*/
var fd = new FormData();
fd.append('file', input.files[0]);
$.ajax({
  url:url,
  type:"POST",
  data: fd,
  processData: false,
  contentType: false,
  success: function(){
    ...
  }
})

/*
* 跨域带cookie
*/
$.ajax({
   url: a_cross_domain_url,
   xhrFields: {
      withCredentials: true
   }
});
```

### axios

```javascript
import axios from "axios";
import qs from "qs"; // 序列化和反序列化参数

// 创建实例级别的请求
const instance = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 0,
  withCredentials: true // 跨域带cookie
});

instance.interceptors.request.use(
  conf => {
    return Object.assign(conf, {
      headers: {
        aaa: "111"
      }
    });
  },
  err => Promise.reject(err)
);

instance.interceptors.response.use(
  res => {
    if (res.data.code === 200) {
      return Promise.resolve(res.data);
    } else {
      return Promise.reject(res);
    }
  },
  err => Promise.reject(err)
);

// application/json
instance.post("url", { a: "111" });

// application/x-www-form-urlencoded
instance.post("url", qs.stringify({ a: "111" }));

// multipart/form-data
var fd = new FormData();
fd.append("file", input.files[0]);
instance.post("url", fd);

// get请求 url参数拼接
instance.get("url", { params: { a: "111" } });
```

这里推荐使用[qs](https://www.npmjs.com/package/qs)库反序列化（解析）和序列化数据，因为浏览器端的`URLSearchParams`兼容性不佳：
{{< caniuse feature="urlsearchparams" >}}

## fetch

可谓下一代的 xhr 代替品，自带 Promise 封装。

```javascript
fetch("url")
  .then(response => response.json())
  .then(function(res) {
    console.log(res);
  });
```

更多请查看：https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
