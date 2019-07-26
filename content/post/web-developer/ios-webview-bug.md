---
date: 2019-07-26
lastmod: 2019-07-26
title: "h5页面嵌套iOS中的坑点"
tags: ["html5", "iOS"]
categories: ["html5", "iOS"]
---

# 原生 iOS 键盘收起对 h5 页面的影响

## 问题描述

iOS 开启 WebView 或者浏览器中嵌入 h5

- 如果当前 h5 页面底部有`position:fixed`，当 iOS 键盘弹出再落回的时候会造成页面底部大量留白。
- 如果是`position:fixed`弹窗，则当键盘收起时，弹窗位置会发生轻微偏移，造成弹窗上的点击失效。
- 甚至正常页面的点击也有这样的问题。

## 解决方案

归根结底，是 iOS 原生键盘收起时，页面整体没有正常回落，导致你看到的页面和实际的有稍许差距。这是 iOS11 以来的经典 bug。

当键盘收起时做以下操作（一般是 input 框 blur 时候）：

- scrollIntoViewIfNeeded 在移动端兼容性非常好

```js
const btn = document.querySelector(".btn");
const test = document.querySelector(".chunk");
btn.addEventListener("click", function() {
  test.scrollIntoViewIfNeeded();
  // 控制页面滚动到当前dom可视的居中位置
});
```

- 采用 window.scroll 强制滚动到头部

```js
setTimeout(() => {
  window.scroll(0, 0);
}, 100);
```

# FastClick 对 textarea 等元素 focus 影响

## 问题描述

FastClick 是对老的手机系统版本 js click 事件延迟 300ms 执行问题做处理的 js 库。如今在 iOS 9.3[^footnote] 以上版本，可以通过简单的 meta 标签来回避这个问题。
[^footnote]: [2019 再聊移动端 300ms 延迟及 fastClick 原理解析](https://juejin.im/post/5ce764a2f265da1b8c19645a)

```html
<meta name="viewport" content="width=device-width" />
```

然而为了适配老的机型，在项目中存在有时候就是累赘，比如会造成表单元素聚焦**非常迟钝**。

## 解决方案

- `needsclick` className 忽略

```html
<div class="item needsclick">My El</div>
<!-- className of needsclick will ignored by fastclick -->
```

- 一种 hack 写法

```vue
<textarea
  autocomplete="off"
  spellcheck="false"
  autocapitalize="off"
  autocorrect="off"
  v-model.trim="test"
  @blur="e => e.target.scrollIntoViewIfNeeded()"
  @click="e => e.target.focus()"
></textarea>
```

# iOS 键盘拼音问题

## 问题描述

iOS 键盘在打拼音的时候，默认 input 事件是不执行的，所以 vue 当中的`v-model`也是没有值的。

## 解决方案

换成`keyup`事件
