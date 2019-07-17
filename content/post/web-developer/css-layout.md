---
date: 2019-07-10
lastmod: 2019-07-11
title: "CSS布局"
draft: false
tags: ["html5", "CSS3"]
categories: ["html5", "CSS3"]
---

<img src="/images/3d-box-model.png">

# 盒模型

{{< blockquote link="https://www.cnblogs.com/fsjohnhuang/p/5259121.html" >}}
`<div></div>`标签被浏览器解析后会生成 div 元素并添加到 document tree 中，但 CSS 作用的对象并不是 document tree，而是根据 document tree 生成的 render tree，而盒子模型就是 render tree 的节点。

- 注意:
- 1. CSS 作用的是盒子(Box), 而不是元素(Element);
- 2. JS 无法直接操作盒子。

{{< /blockquote >}}

## IE 盒模型（怪异盒模型）

```
width = content-width + padding-width + border-width
height = content-height + padding-height + border-height

```

## 标准盒模型

```
width = content-width
height = content-height
```

{{% notice note 注意 %}}
默认大多数浏览器盒模型处理方式是标准盒模型。但是为了符合人们大多数的布局习惯，可以通过设置`box-sizing:border-box`，转换成 IE 盒模型，这也是大多数布局样式的首选方式。
{{% /notice %}}

```css
*,
*:before,
*:after {
  box-sizing: border-box;
}

/* or  */
/* Vendor Prefixes & inherit  */
html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}
```

# BFC

{{< blockquote title="10 分钟理解 BFC 原理" link="https://zhuanlan.zhihu.com/p/25321647" >}}
那么 BFC 是什么呢？

BFC 即 Block Formatting Contexts (块级格式化上下文)，它属于上述定位方案的普通流。

具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。

通俗一点来讲，可以把 BFC 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到外部。

{{< /blockquote >}}

## 触发 BFC

- 根元素(html)
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- 表格单元格（元素的 display 为 table-cell，HTML 表格单元格默认为该值）
- 表格标题（元素的 display 为 table-caption，HTML 表格标题默认为该值）
- overflow 值不为 visible 的块元素
- 弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）

_以上内容来自[^footnote1]_
[^footnote1]:https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context

## 应用

### 双 div 外边距发生折叠

通过设置`overflow: hidden`触发 BFC，即可变成正常`margin`边距

### 清除浮动

内部元素设置浮动脱离普通文档流造成高度坍陷，父元素设置`overflow: hidden`，即可正常包裹内部元素。

### 两列自适应布局

```html
<div style="height: 100px;width: 100px;float: left;background: lightblue">
  我是一个左浮动的元素
</div>
<div style="width: 200px; height: 200px;background: #eee">
  我是一个没有设置浮动, 也没有触发 BFC 元素, width: 200px; height:200px;
  background: #eee;
</div>
```

此时左边元素会覆盖右边元素，通过设置右边元素`overflow: hidden`，就会正常两列排版。

### 行内元素

常见的 `span,img,button,input,label` 等。更多行内元素请查看[^footnote2]
[^footnote2]: https://developer.mozilla.org/zh-CN/docs/Web/HTML/Inline_elements
<br>

{{% notice note 注意 %}}
行内元素除了 img 外均**忽略宽高**  
高度依靠`font-size line-height`  
padding,margin 只在水平方向实现，垂直方向无效
line,line-block 会有空白间隙，通过设置父元素`font-size:0`解决
{{% /notice %}}

## 应用

### 水平居中

当前元素设置`inline-block`，通过设置父容器 `text-align:center` 则可以使其水平居中。

### 垂直居中

当前元素设置`inline-block`，元素撑开父元素高度，然后设置其 vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。  
常见的图标和字体上下对齐，设置 img `vertical-align:middle`

# 参考文档

- [块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)
- [小科普：到底什么是 BFC、IFC、GFC 和 FFC](https://juejin.im/entry/5938daf7a0bb9f006b2295db)
- [10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)
- [IFC、BFC、GFC 与 FFC 知多少](https://www.liayal.com/article/5a4b645276b2f863f44722cf)
