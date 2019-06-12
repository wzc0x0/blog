---
date: 2019-05-31
lastmod: 2019-06-10
title: "移动端适配"
draft: false
tags: ["html5"]
categories: ["html5"]
---

# 探究 web 移动端适配，到底是 rem 还是 px？

这个问题也困扰笔者很多年，最开始一味地使用 rem，但是到现在觉得 rem 不再合适。

{{< blockquote author="知乎-猫5号" link="https://www.zhihu.com/question/313971223" >}}
为什么有 rem 来实现适应的方案，因为当年 viewport 在低版本安卓设备上还有兼容问题，而 vw，vh 还没能跑遍所有浏览器，所以 flexible 方案用 rem 来模拟 vmin 来实现在不同设备等比缩放的“一竹竿”方案

为什么说等比缩放是一竹竿，你想想在 ipad 这么大的设备跟和 iphone5 这么小的设备用同一套设计图，你就知道问题所在

逻辑像素是用来调和不同设备，不同 dpr，不同屏幕，不同分辨率，不同观看距离之间的如何解决显示问题的方案

要清楚，是调和，不是解决，解决仍需要人去解决，因为不同设备，**在同样观赏距离看到的内容多少肯定是不一样的**
{{< /blockquote >}}

## px 适配

首先设置 meta 标签

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<!-- ios10+ 之后禁止缩放meta标签已经控制不了 -->
```

{{< blockquote author="知乎-猫5号" link="https://www.zhihu.com/question/313971223" >}}
都 9102 了  
都不知道 px 是 viewport 像素，  
而 viewport 像素又是什么，其实是浏览器内部对逻辑像素进行再处理的结果，简单来理解就是调整逻辑像素的缩放来达到适应设备的一个中间层  
那么 viewport width=device-width 是什么意思，**其实就是让 viewport 的尺寸等于逻辑像素的尺寸**

**逻辑像素（device point）**，是为了调和距离不一样导致的差异，将所有设备根据距离，透视缩放到一个相等水平的观看距离之后得到的尺寸，是一个抽象的概念
{{< /blockquote >}}

{{< blockquote  link="https://mp.weixin.qq.com/s/oF6oAjdzguv9OwE9cdLrPQ" >}}
为了在移动端让页面获得更好的显示效果，我们必须让布局视口、视觉视口都尽可能等于理想视口。

`device-width`就等于理想视口的宽度，所以设置 `width=device-width`就相当于让布局视口等于理想视口。

由于 initial-scale=理想视口宽度/视觉视口宽度，所以我们设置 `initial-scale=1`;就相当于让视觉视口等于理想视口。

这时，1 个 CSS 像素就等于 1 个设备独立像素，而且我们也是基于理想视口来进行布局的，所以呈现出来的页面布局在各种设备上都能大致相似。
{{< /blockquote >}}

上面引用其他人的解释，这样我们就可以按照 **iPhone6（宽 375px）**布局了。  
px 布局总结几点：

- banner 图这些的，用 vw 做缩放，在不同机型上合理展示。
- 多用 flex 布局，加上浏览器厂商前缀兼容性已经近乎 100%。
- 多用 padding 布局，居中、间隙都可以使用 padding。

{{< gallery caption-effect="none">}}
{{< figure src="/images/px-preview.png" title="px 布局在iPhone6p下的截图">}}
{{< figure src="/images/rem-preview.png" title="rem 布局在iPhone6p下的截图">}}
{{< /gallery >}}

从截图可以看出，在同样的 iPhone6p（宽 414px）机型上，rem 布局明显放大了。因为 rem 是以 iPhone6 作为基础宽度布局，在不同的机型放大缩小来呈现一致的布局。

这就回到一个问题上来了，那就是：**大屏手机是为了一屏看到更多还是看的更大？**我觉得大部分人不是去买老人机，大屏应该是看的更多，阅读效率更高！

{{% notice tip 题外话 %}}
写到这里，突然想起来 iOS 同事告诉我他们的布局方式是相对于屏幕边距的精确 pt 布局，没有缩放可以简单适配到 iPad。这和我这个 px 布局如出一辙。又感叹到 iOS 不愧是移动端之王！（iOS 在业界各类的解决方早已做到了最好，如虚拟列表等。）
{{% /notice %}}

## 自适应和响应式

这是两种布局方式，自适应是一种简单适配不同机型的解决方案，比如 rem，px 流式布局等。而配合媒体查询，在屏幕尺寸差距很大的设备上实现多种布局样式，就是所谓的响应式布局方案，列如经典的[bootstrap](https://getbootstrap.com/)等。

常见屏幕的媒体查询，[更多请查看](http://stephen.io/mediaqueries/)。

```css
@media (max-width: 320px) {
  /* iPhone4、iPhone5、iPhoneSE */
}

@media (max-width: 375px) {
  /* iPhone6、iPhone7、iPhoneX */
}

@media (max-width: 414px) {
  /* iPhone6p、iPhone7p */
}
```

## 1px 问题

众所周知在 dpr>=2 机型 1px border 线并不是真正的 1px 会加粗。常见的解决方案：

### `postcss-write-svg`

postcss 插件[postcss-write-svg](https://www.npmjs.com/package/postcss-write-svg)绘制 1px svg border-image。  
配合 webpack、parcel 等构建工具在根目录创建`.postcssrc.js`文件：

```js
module.exports = {
  plugins: {
    "postcss-write-svg": {}
  }
};
```

css 变量引入，webpack 全局引入需要`style-resources-loader`插件

```css
@svg border {
  width: 4px;
  height: 4px;
  @rect {
    fill: transparent;
    width: 100%;
    height: 100%;
    stroke-width: 25%;
    stroke: var(--color, black);
  }
}

/* 1px border */
.border {
  width: 300px;
  height: 300px;
  border: 1px solid;
  border-image: svg(border param(--color black)) 1 stretch;
}

/* 1px border left */
.border-left {
  width: 300px;
  height: 300px;
  border: 0;
  border-left: 1px solid;
  border-image: svg(border param(--color yellow)) 1 stretch;
}
```

缺点：不能实现圆角

### html 伪类实现

```css
.circle {
  width: 300px;
  height: 300px;
  border: 0;
  position: relative;
}

.circle::after {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  border: 1px solid black;
  border-radius: 20px;
  transform-origin: 0 0;
  transform: scale(0.5);
}

.fake-border-left {
  width: 300px;
  height: 300px;
  position: relative;
  border: 0;
}

.fake-border-left::after {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  border-right: 1px solid black;
  transform-origin: 0 0;
  transform: scale(0.5);
}
```

特点：可以兼容圆角，简单实用，代码量多。

### iOS8+ 独有 0.5px

只有 iOS 平台有 0.5px，其他平台均不能正常显示，不推荐

---

效果如下：
{{< codepen id="gNOKNr" >}}
