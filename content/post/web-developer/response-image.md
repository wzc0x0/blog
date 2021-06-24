---
date: 2021-06-24
title: "html5响应式图片的实现方式"
draft: false
tags: ["html5"]
categories: ["html5"]
---

# 前言

利用 html5 原生标签属性实现不同的分辨率，不同窗口之间的图片适配

<!-- more -->

## img 标签`srcset`属性分辨率响应

```html
<!-- 2倍图 3倍图 -->
<img
  src="http://placehold.it/120"
  class="response-image"
  srcset="http://placehold.it/240 2x, http://placehold.it/360 3x"
  onerror="this.src='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//AK3/ALYH+5hX6FV5N4Y/5GHwx/vyf+iJa9ZrysPhoYVShDZu/potDmwWFhhIzhT2bv6aLQ//Z'"
/>
```

### srcset 兼容性

{{< caniuse feature="srcset" >}}

## picture 标签窗口宽度适配响应

```html
<!-- 类似媒体查询，不符合就降级处理到img -->
<picture>
  <source media="(max-width: 320px)" srcset="http://placehold.it/320" />
  <source media="(max-width: 480px)" srcset="http://placehold.it/480" />
  <img src="http://placehold.it/500/abc" />
</picture>
```

## picture 标签扩展

```html
<!-- 支持多种图片格式，可以降级处理到img -->
<picture>
  <source
    type="image/vnd.ms-photo"
    srcset="http://placehold.it/500.vnd.ms-photo"
  />
  <source type="image/jp2" srcset="http://placehold.it/1000.jp2" />
  <source type="image/webp" srcset="http://placehold.it/1500.webp" />
  <img src="http://placehold.it/500/abc" />
</picture>
```

### 兼容性

{{< caniuse feature="picture" >}}
