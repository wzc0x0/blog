---
date: 2019-07-11
title: "你所不知的CSS"
draft: false
tags: ["html5", "CSS3"]
categories: ["html5", "CSS3"]
---

# 前言

收录一下 CSS 技巧吧

# 单行多行截取文本

```css
/* 单行截取 */
 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

```css
/* 多行移动端适用 */
 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical; //属性规定框的子元素应该被水平或垂直排列
  -webkit-line-clamp: 3; //这个属性适合WebKit浏览器或移动端（绝大部分是WebKit内核的）浏览器
}
```

# 操作伪元素（pseudo-element）

## 获取伪元素的属性值

```javascript
//获取before伪元素的字号大小
var div = document.querySelector("div");
var fontSize = window
  .getComputedStyle(div, "::before")
  .getPropertyValue("font-size");
```

## 设置伪元素的属性值

```html
<p data-foo="hello">world</p>
<style>
  p:before {
    content: attr(data-foo);
  }
</style>
<!-- attr()支持多个连写，而且attr()内可以是DOM元素的任意属性 -->
```

# 参考文档

- [你所不知道的 css](https://juejin.im/post/5c18fd82f265da614273d585)
